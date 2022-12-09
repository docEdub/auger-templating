cmake_minimum_required(VERSION 3.17)

project("Test")

get_filename_component(ROOT_DIR "${CMAKE_SOURCE_DIR}" ABSOLUTE)
get_filename_component(BUILD_DIR "${CMAKE_BINARY_DIR}" ABSOLUTE)
get_filename_component(SRC_DIR "${ROOT_DIR}/src" ABSOLUTE)
get_filename_component(TOOLS_DIR "${ROOT_DIR}/tools" ABSOLUTE)


set(VERBOSE off CACHE BOOL "")
set(VERBOSE_CLI_FLAG "")
set(VERBOSE_CLI_SILENCER ">/dev/null")
if(${VERBOSE})
    set(VERBOSE_CLI_FLAG "--verbose")
    set(VERBOSE_CLI_SILENCER "")
endif()


function(verbose_log)
    if(${VERBOSE})
        message("${ARGN}")
    endif()
endfunction()


function(get_filename_as_target filename out_target)
    string(REPLACE "/" "-" target "${filename}")
    string(REPLACE " " "-" target "${target}")
    set(${out_target} "${target}" PARENT_SCOPE)
endfunction()


function(get_typescript_build_dependencies_filename source out_filename)
    string(REPLACE ".ts" ".js.d" filename "${BUILD_DIR}/.dependencies/${source}")
    set(${out_filename} "${filename}" PARENT_SCOPE)
endfunction()


function(get_typescript_build_root_filename source out_filename)
    string(REPLACE ".ts" ".js" filename "${BUILD_DIR}/.root/${source}")
    set(${out_filename} "${filename}" PARENT_SCOPE)
endfunction()


function(add_check_dependencies_are_gone_target dependency_file out_target)
    string(REPLACE "${ROOT_DIR}/" "" relative_dependency_file "${dependency_file}")
    get_filename_component(dependency_file_basename "${dependency_file}" NAME)
    get_filename_as_target("${dependency_file_basename}" target)
    set(target "areDependenciesGone-${target}")
    string(REPLACE ".d.tmp" "" dependency_file_basename "${dependency_file_basename}")
    add_custom_target(${target}
        COMMENT "Checking ${dependency_file_basename} dependencies"
        COMMAND node "${TOOLS_DIR}/areDependenciesGone.js"
            --dependency-file "${dependency_file}"
            || (
                echo "test" &&
                echo "Reconfiguring CMake due to missing dependency in \"${relative_dependency_file}\"\\\\n" &&
                "${CMAKE_COMMAND}" -E rm "${dependency_file}" &&
                cd "${ROOT_DIR}" &&
                "${CMAKE_COMMAND}" -B "${BUILD_DIR}"
            )
    )
    set(${out_target} ${target} PARENT_SCOPE)
endfunction()


# Adds a custom command to run `webpack` if the given template helper source changes or if any of its dependencies
# change ("dependencies" being the files brought in by the TypeScript `import` statement).
#
# To ensure the final dependency file is only updated when the dependencies actually change and not just when the
# source or current dependencies are saved without changing the TypeScript `import` statements, dependency change
# tracking is done in two steps:
# 1. The first step blindly dumps the template helper source's current dependencies to an intermediate file suffixed
#    with `.js.d.tmp when the source or any of its dependencies change.
# 2. If the final dependencies file does not exist it is created by copying the intermediate file. If the final
#    dependencies file already exists it is updated to match the intermediate file if its contents differ. If the
#    contents are the same then the final dependencies file is left unchanged.
# If any of the final dependency files change then the `dependencies` target (added later) will re-run CMake configure
# to update the template helper source's dependencies list in the generated project or makefile.
#
function(add_custom_command_for_template_helper)
    set(source "${ARGN}")

    if(NOT ${source} IN_LIST _custom_command_template_helper_sources)
        list(APPEND _custom_command_template_helper_sources "${source}")
        set(_custom_command_template_helper_sources ${_custom_command_template_helper_sources} PARENT_SCOPE)

        get_typescript_build_root_filename("${source}" output)
        verbose_log("Adding custom command for \"${source}\" -> \"${output}\".")

        get_typescript_build_dependencies_filename("${source}" dependencies_output)
        execute_process(
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${TOOLS_DIR}/getTypescriptFileDependencies.js"
                --helper-file "${source}"
                --output-file "${dependencies_output}.tmp"
                ${VERBOSE_CLI_FLAG}
        )
        if(EXISTS "${dependencies_output}")
            set(command "${CMAKE_COMMAND}" -E copy_if_different "${dependencies_output}.tmp" "${dependencies_output}")
            verbose_log("Executing process \"${command}\"")
            execute_process(
                WORKING_DIRECTORY "${ROOT_DIR}"
                COMMAND ${command}
            )
        else()
            set(command "${CMAKE_COMMAND}" -E copy "${dependencies_output}.tmp" "${dependencies_output}")
            verbose_log("Executing process \"${command}\"")
            execute_process(
                WORKING_DIRECTORY "${ROOT_DIR}"
                COMMAND ${command}
            )
        endif()
        set(command "${CMAKE_COMMAND}" -E touch "${BUILD_DIR}/.dependencies/.reconfigure.stamp")
        verbose_log("Executing process \"${command}\"")
        execute_process(
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND ${command}
        )
        file(READ "${dependencies_output}" dependencies)

        get_filename_component(source_dir "${source}" DIRECTORY)
        string(REPLACE "./" "${ROOT_DIR}/${source_dir}/" dependencies "${dependencies}")
        string(REPLACE "\n" ";" dependencies "${dependencies}")
        verbose_log("dependencies = ${dependencies}")

        add_check_dependencies_are_gone_target("${dependencies_output}.tmp" check_dependencies_are_gone)

        add_custom_command(
            COMMENT "Updating ${source} dependencies ..."
            OUTPUT "${dependencies_output}.tmp"
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${TOOLS_DIR}/getTypescriptFileDependencies.js"
                --helper-file "${source}"
                --output-file "${dependencies_output}.tmp"
                ${VERBOSE_CLI_FLAG}
                && ${CMAKE_COMMAND} -E copy_if_different "${dependencies_output}.tmp" "${dependencies_output}"
            DEPENDS
                ${dependencies}
                ${check_dependencies_are_gone}
                "${TOOLS_DIR}/areDependenciesGone.js"
        )

        get_filename_component(target "${source}" NAME)
        set(target "dependencies_${target}")
        add_custom_target(${target} ALL DEPENDS "${dependencies_output}.tmp")

        set_property(GLOBAL APPEND PROPERTY _reconfigure_dependencies ${target} "${dependencies_output}")
        set_property(GLOBAL APPEND PROPERTY _webpack_dependencies ${dependencies})
        set_property(GLOBAL APPEND PROPERTY _webpack_dependencies ${check_dependencies_are_gone})
    endif()
endfunction()


function(add_custom_commands_for_template_sources)
    set(options OPTIONS)
    set(one_value_keywords ONE_VALUE_KEYWORDS)
    set(multi_value_keywords
        HELPERS
        INSTRUMENTS
        JSON
        OPCODES
        SCORES
        SOURCES
    )
    cmake_parse_arguments(ARG "${options}" "${one_value_keywords}" "${multi_value_keywords}" ${ARGN})

    foreach(helper ${ARG_HELPERS})
        add_custom_command_for_template_helper("${helper}")
        get_typescript_build_root_filename("${helper}" output_filename)
        list(APPEND helpers "${output_filename}")
    endforeach()

    foreach(source ${ARG_OPCODES} ${ARG_INSTRUMENTS} ${ARG_SCORES} ${ARG_SOURCES})
        add_custom_command(
            COMMENT "Generating ${source} ..."
            OUTPUT "${BUILD_DIR}/.root/${source}"
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${TOOLS_DIR}/buildTemplateFiles.js"
                --build-dir "${BUILD_DIR}"
                --instruments ${ARG_INSTRUMENTS}
                --opcodes ${ARG_OPCODES}
                --scores ${ARG_SCORES}
                --helper-files ${ARG_HELPERS}
                --json-files ${ARG_JSON}
                --source "${source}"
                ${VERBOSE_CLI_FLAG}
            DEPENDS
                "${TOOLS_DIR}/buildTemplateFiles.js"
                ${helpers}
                "${ARG_JSON}"
                "${source}"
        )

        set_property(GLOBAL APPEND PROPERTY _generated_templates "${BUILD_DIR}/.root/${source}")
    endforeach()
endfunction()


add_custom_commands_for_template_sources(
    OPCODES
        "udo/time_i.orc"
        "udo/time_k.orc"
        "udo/timeString_i.orc"
        "udo/timeString_k.orc"
    INSTRUMENTS
        "instr/instr 1.orc"
    SCORES
        "sco/instr 1.sco"
    SOURCES
        "csd/test-a.csd"
        "csd/test-b.csd"
    JSON
        "csd/test-a.json"
        "csd/test-b.json"
        "json/types-a.json"
        "json/types-b.json"
        "json/csound-definitions.json"
    HELPERS
        "src/Cabbage/cabbageTemplateHelper.ts"
        "src/Csound/csoundTemplateHelper.ts"
)


# Add target needed to update CMake configuration when TypeScript imports change.
#
# The `_reconfigure_dependencies` list contains;
#   1. The targets that update the .js.d files if different from the matching .js.d.tmp files.
#   2. The .js.d files themselves.
#
# The targets in the `_reconfigure_dependencies` list ensure the .js.d.tmp files are always updated when their .ts
# files change. The .js.d files in this list ensure the following command is run when the TypeScript imports actually
# change.
#
get_property(_reconfigure_dependencies GLOBAL PROPERTY _reconfigure_dependencies)
verbose_log("_reconfigure_dependencies = ${_reconfigure_dependencies}")
add_custom_command(
    COMMENT "Updating CMake configuration due to changed dependencies ..."
    OUTPUT "${BUILD_DIR}/.dependencies/.reconfigure.stamp"
    WORKING_DIRECTORY "${ROOT_DIR}"
    COMMAND "${CMAKE_COMMAND}" -B "${BUILD_DIR}"
    DEPENDS ${_reconfigure_dependencies}
)
add_custom_target(dependencies ALL DEPENDS "${BUILD_DIR}/.dependencies/.reconfigure.stamp")


get_property(_webpack_dependencies GLOBAL PROPERTY _webpack_dependencies)
verbose_log("_webpack_dependencies = ${_webpack_dependencies}")
add_custom_command(
    COMMENT "Running webpack ..."
    OUTPUT "${BUILD_DIR}/.root/.webpack.stamp"
    WORKING_DIRECTORY "${BUILD_DIR}"
    COMMAND npm run webpack
    DEPENDS
        ${_webpack_dependencies}
        "${ROOT_DIR}/webpack.config.js"
)
add_custom_target(webpack ALL DEPENDS "${BUILD_DIR}/.root/.webpack.stamp")


# Add the target needed to generate the templates when one or more of the following occurs:
#   1. Template helper files change causing the webpack command to be run.
#   2. Template .json files change.
#   3. Template source files change.
#
# This target must be run after the `dependencies` target has run.
#
get_property(_generated_templates GLOBAL PROPERTY _generated_templates)
verbose_log("_generated_templates = ${_generated_templates}")
add_custom_target(templates ALL DEPENDS dependencies webpack ${_generated_templates})
