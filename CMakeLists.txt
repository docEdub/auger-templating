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


function(get_template_helper_output_filename)
    string(REPLACE ".ts" ".js" output "${BUILD_DIR}/.root/${ARGV0}")
    set(${ARGV1} "${output}" PARENT_SCOPE)
endfunction()


function(get_template_helper_depdencies_output_filename)
    string(REPLACE ".ts" ".js.d" output "${BUILD_DIR}/.dependencies/${ARGV0}")
    set(${ARGV1} "${output}" PARENT_SCOPE)
endfunction()


function(get_filename_as_target filename out_target)
    string(REPLACE "/" "-" target "${filename}")
    string(REPLACE " " "-" target "${target}")
    set(${out_target} "${target}" PARENT_SCOPE)
endfunction()


# Adds a custom command to run `webpack` if the given template helper source changes, or if any of its dependencies
# change ("dependencies" being the files brought in by the TypeScript `import` statement).
#
# To ensure the final dependency file is only updated when the dependencies actually change and not just when the
# source or current dependencies are modified without changing the TypeScript `import` statements, dependency change
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

        get_template_helper_output_filename("${source}" output)
        verbose_log("Adding custom command for \"${source}\" -> \"${output}\".")

        get_template_helper_depdencies_output_filename("${source}" dependencies_output)
        execute_process(
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${TOOLS_DIR}/getTypescriptFileDependencies.js"
                --helper-file "${source}"
                --output-file "${dependencies_output}.tmp"
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
        string(REPLACE "\n" ".ts;" dependencies "${dependencies}")
        verbose_log("dependencies = ${dependencies}")

        add_custom_command(
            COMMENT "Updating ${source} dependencies ..."
            OUTPUT "${dependencies_output}.tmp"
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${TOOLS_DIR}/getTypescriptFileDependencies.js"
                --helper-file "${source}"
                --output-file "${dependencies_output}.tmp"
                && ${CMAKE_COMMAND} -E copy_if_different "${dependencies_output}.tmp" "${dependencies_output}"
            DEPENDS ${dependencies}
        )

        string(REPLACE "${BUILD_DIR}/.dependencies/" "" target "${dependencies_output}.tmp")
        get_filename_as_target("${target}" target)
        add_custom_target(${target} ALL DEPENDS "${dependencies_output}.tmp")

        set_property(GLOBAL APPEND PROPERTY _reconfigure_dependencies ${target} "${dependencies_output}")

        add_custom_command(
            COMMENT "Running webpack ..."
            OUTPUT "${BUILD_DIR}/.root/.webpack.stamp"
            WORKING_DIRECTORY "${BUILD_DIR}"
            COMMAND npm run webpack ${VERBOSE_CLI_SILENCER}
            DEPENDS
                "${source}"
                ${dependencies}
                "${ROOT_DIR}/webpack.config.js"
        )
    endif()
endfunction()


function(add_custom_commands_for_template_sources)
    set(options OPTIONS)
    set(one_value_keywords ONE_VALUE_KEYWORDS)
    set(multi_value_keywords
        HELPERS
        JSON
        SOURCES
    )
    cmake_parse_arguments(ARG "${options}" "${one_value_keywords}" "${multi_value_keywords}" ${ARGN})

    foreach(helper ${ARG_HELPERS})
        add_custom_command_for_template_helper("${helper}")

        get_template_helper_output_filename("${helper}" output_filename)
        list(APPEND helpers "${output_filename}")
    endforeach()

    foreach(source ${ARG_SOURCES})
        add_custom_command(
            COMMENT "Generating ${source} ..."
            OUTPUT "${BUILD_DIR}/.root/${source}"
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${TOOLS_DIR}/buildTemplateFiles.js"
                --build-dir "${BUILD_DIR}"
                --helper-files ${ARG_HELPERS}
                --json-files ${ARG_JSON}
                --source "${source}"
                ${VERBOSE_CLI_FLAG}
            DEPENDS
                "${source}"
                ${helpers}
                "${TOOLS_DIR}/buildTemplateFiles.js"
        )

        list(APPEND _generated_templates "${BUILD_DIR}/.root/${source}")
        set(_generated_templates ${_generated_templates} PARENT_SCOPE)
    endforeach()
endfunction()


add_custom_commands_for_template_sources(
    HELPERS
        "src/Cabbage/cabbageTemplateHelper.ts"
        "src/CsoundQt/csoundQtTemplateHelper.ts"
    JSON
        "csd/test.ui.json"
        "csd/types-a.json"
        "csd/types-b.json"
    SOURCES
        "csd/test-a.csd"
        "csd/test-b.csd"
)


# Add target needed to update CMake configuration when TypeScript imports change.
#
# The `_reconfigure_dependencies` list contains the targets that update the .js.d files if different from the matching
# .js.d.tmp files, and the .js.d files themselves. The targets in this list ensure the .js.d.tmp files are always
# updated when their .ts files change. The .js.d files in this list ensure the following command is run when the
# TypeScript imports actually change.
#
get_property(_reconfigure_dependencies GLOBAL PROPERTY _reconfigure_dependencies)
verbose_log("_reconfigure_dependencies = ${_reconfigure_dependencies}")
add_custom_command(
    COMMENT "Updating CMake configuration due to changed dependencies ..."
    OUTPUT "${BUILD_DIR}/.dependencies/.reconfigure.stamp"
    WORKING_DIRECTORY "${ROOT_DIR}"
    COMMAND "${CMAKE_COMMAND}" -B "${BUILD_DIR}" # && "${CMAKE_COMMAND}" -E touch "${BUILD_DIR}/.dependencies/.reconfigure.stamp"
    DEPENDS ${_reconfigure_dependencies}
)
add_custom_target(dependencies ALL DEPENDS "${BUILD_DIR}/.dependencies/.reconfigure.stamp")


# Add target needed to generate templates if webpack was run or template sources changed.
#
# This target must be run after the `dependencies` target has run.
#
add_custom_target(templates ALL DEPENDS "${BUILD_DIR}/.root/.webpack.stamp" ${_generated_templates} dependencies)
