
set(CsoundTemplateHelpers_SourceDir "${CMAKE_CURRENT_LIST_DIR}")
set(CsoundTemplateHelpers_ScriptsSourceDir "${CMAKE_CURRENT_LIST_DIR}/scripts")
set(CsoundTemplateHelpers_BuildOutputDir "${BUILD_OUTPUT_DIR}/CsoundTemplateHelpers")
set(CsoundTemplateHelpers_BuildDependenciesDir "${BUILD_DEPENDENCIES_DIR}/CsoundTemplateHelpers")

set_property(GLOBAL PROPERTY CsoundTemplateHelpers_SourceDir "${CsoundTemplateHelpers_SourceDir}")
set_property(GLOBAL PROPERTY CsoundTemplateHelpers_ScriptsSourceDir "${CsoundTemplateHelpers_ScriptsSourceDir}")
set_property(GLOBAL PROPERTY CsoundTemplateHelpers_BuildOutputDir "${CsoundTemplateHelpers_BuildOutputDir}")
set_property(GLOBAL PROPERTY CsoundTemplateHelpers_BuildDependenciesDir "${CsoundTemplateHelpers_BuildDependenciesDir}")

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
    string(REPLACE ".ts" ".js.d" filename "${BUILD_DEPENDENCIES_DIR}/${source}")
    set(${out_filename} "${filename}" PARENT_SCOPE)
endfunction()


function(get_typescript_build_output_filename source out_filename)
    string(REPLACE ".ts" ".js" filename "${BUILD_OUTPUT_DIR}/${source}")
    set(${out_filename} "${filename}" PARENT_SCOPE)
endfunction()


function(add_check_dependencies_are_gone_target dependency_file out_target)
    get_property(CsoundTemplateHelpers_ScriptsSourceDir GLOBAL PROPERTY CsoundTemplateHelpers_ScriptsSourceDir)

    get_filename_component(dependency_file_basename "${dependency_file}" NAME)
    get_filename_as_target("${dependency_file_basename}" target)
    string(REPLACE ".d.tmp" "" dependency_file_basename "${dependency_file_basename}")
    set(target "areDependenciesGone_${target}")
    string(REPLACE "${ROOT_DIR}/" "" relative_dependency_file "${dependency_file}")

    add_custom_target(${target}
        COMMENT "Checking ${dependency_file_basename} dependencies"
        COMMAND node "${CsoundTemplateHelpers_ScriptsSourceDir}/areDependenciesGone.js"
            --dependency-file "${dependency_file}"
            ${VERBOSE_CLI_FLAG}
            || (
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
    get_property(CsoundTemplateHelpers_ScriptsSourceDir GLOBAL PROPERTY CsoundTemplateHelpers_ScriptsSourceDir)
    get_property(CsoundTemplateHelpers_BuildDependenciesDir GLOBAL PROPERTY CsoundTemplateHelpers_BuildDependenciesDir)
    set(source "${ARGN}")

    if(NOT ${source} IN_LIST _custom_command_template_helper_sources)
        list(APPEND _custom_command_template_helper_sources "${source}")
        set(_custom_command_template_helper_sources ${_custom_command_template_helper_sources} PARENT_SCOPE)
        get_typescript_build_output_filename("${source}" output)
        get_typescript_build_dependencies_filename("${source}" dependencies_output)

        verbose_log("Adding custom command for \"${source}\" -> \"${output}\".")

        execute_process(
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${CsoundTemplateHelpers_ScriptsSourceDir}/getTypescriptFileDependencies.js"
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
        file(READ "${dependencies_output}" dependencies)

        set(command "${CMAKE_COMMAND}" -E touch "${CsoundTemplateHelpers_BuildDependenciesDir}/.reconfigure.stamp")
        verbose_log("Executing process \"${command}\"")

        execute_process(
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND ${command}
        )

        get_filename_component(source_dir "${source}" DIRECTORY)
        string(REPLACE "./" "${ROOT_DIR}/${source_dir}/" dependencies "${dependencies}")
        string(REPLACE "\n" ";" dependencies "${dependencies}")
        verbose_log("dependencies = ${dependencies}")

        add_check_dependencies_are_gone_target("${dependencies_output}.tmp" check_dependencies_are_gone)

        add_custom_command(
            COMMENT "Updating ${source} dependencies ..."
            OUTPUT "${dependencies_output}.tmp"
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${CsoundTemplateHelpers_ScriptsSourceDir}/getTypescriptFileDependencies.js"
                --helper-file "${source}"
                --output-file "${dependencies_output}.tmp"
                ${VERBOSE_CLI_FLAG}
                && ${CMAKE_COMMAND} -E copy_if_different "${dependencies_output}.tmp" "${dependencies_output}"
            DEPENDS
                ${dependencies}
                ${check_dependencies_are_gone}
                "${CsoundTemplateHelpers_ScriptsSourceDir}/areDependenciesGone.js"
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
    get_property(CsoundTemplateHelpers_SourceDir GLOBAL PROPERTY CsoundTemplateHelpers_SourceDir)
    get_property(CsoundTemplateHelpers_ScriptsSourceDir GLOBAL PROPERTY CsoundTemplateHelpers_ScriptsSourceDir)
    get_property(CsoundTemplateHelpers_BuildOutputDir GLOBAL PROPERTY CsoundTemplateHelpers_BuildOutputDir)

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

        get_typescript_build_output_filename("${helper}" output_filename)
        list(APPEND helpers "${output_filename}")
    endforeach()

    foreach(source ${ARG_OPCODES} ${ARG_INSTRUMENTS} ${ARG_SCORES} ${ARG_SOURCES})
        add_custom_command(
            COMMENT "Generating ${source} ..."
            OUTPUT "${BUILD_OUTPUT_DIR}/${source}"
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${CsoundTemplateHelpers_ScriptsSourceDir}/buildTemplateFiles.js"
                --build-dir "${BUILD_DIR}"
                --instruments ${ARG_INSTRUMENTS}
                --opcodes ${ARG_OPCODES}
                --scores ${ARG_SCORES}
                --helper-files ${ARG_HELPERS}
                --json-files ${ARG_JSON}
                --source "${source}"
                ${VERBOSE_CLI_FLAG}
            DEPENDS
                "${CsoundTemplateHelpers_ScriptsSourceDir}/buildTemplateFiles.js"
                ${helpers}
                "${ARG_JSON}"
                "${source}"
        )

        set_property(GLOBAL APPEND PROPERTY _generated_templates "${BUILD_OUTPUT_DIR}/${source}")
    endforeach()

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
        OUTPUT "${CsoundTemplateHelpers_BuildDependenciesDir}/.reconfigure.stamp"
        WORKING_DIRECTORY "${ROOT_DIR}"
        COMMAND "${CMAKE_COMMAND}" -B "${BUILD_DIR}"
        DEPENDS ${_reconfigure_dependencies}
    )

    add_custom_target(dependencies ALL DEPENDS "${CsoundTemplateHelpers_BuildDependenciesDir}/.reconfigure.stamp")

    get_property(_webpack_dependencies GLOBAL PROPERTY _webpack_dependencies)
    verbose_log("_webpack_dependencies = ${_webpack_dependencies}")

    add_custom_command(
        COMMENT "Running webpack ..."
        OUTPUT "${CsoundTemplateHelpers_BuildOutputDir}/.webpack.stamp"
        WORKING_DIRECTORY "${BUILD_DIR}"
        COMMAND npm run _webpack
        DEPENDS
            ${_webpack_dependencies}
            "${CsoundTemplateHelpers_SourceDir}/webpack.config.js"
    )

    add_custom_target(webpack ALL DEPENDS "${CsoundTemplateHelpers_BuildOutputDir}/.webpack.stamp")

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
endfunction()
