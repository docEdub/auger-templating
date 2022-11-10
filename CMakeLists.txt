cmake_minimum_required(VERSION 3.17)

project("Test")

set(VERBOSE off CACHE BOOL "")
set(VERBOSE_CLI_FLAG "")
if(${VERBOSE})
    set(VERBOSE_CLI_FLAG "--verbose")
endif()

function(verbose_log)
    if(${VERBOSE})
        message("${ARGN}")
    endif()
endfunction()

get_filename_component(ROOT_DIR "${CMAKE_SOURCE_DIR}" ABSOLUTE)
get_filename_component(BUILD_DIR "${CMAKE_BINARY_DIR}" ABSOLUTE)
get_filename_component(SRC_DIR "${ROOT_DIR}/src" ABSOLUTE)
get_filename_component(TOOLS_DIR "${ROOT_DIR}/tools" ABSOLUTE)


function(get_template_helper_output_filename)
    string(REPLACE ".ts" ".js" output "${BUILD_DIR}/.root/${ARGV0}")
    set(${ARGV1} "${output}" PARENT_SCOPE)
endfunction()

function(add_custom_command_for_template_helper)
    set(source "${ARGN}")

    if(NOT ${source} IN_LIST _custom_command_template_helper_sources)
        list(APPEND _custom_command_template_helper_sources "${source}")
        set(_custom_command_template_helper_sources ${_custom_command_template_helper_sources} PARENT_SCOPE)


        get_template_helper_output_filename("${source}" output)
        verbose_log("Adding custom command for \"${source}\" -> \"${output}\".")

        add_custom_command(
            COMMENT "Generating template helper .js files"
            OUTPUT "${output}"
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND npm run webpack
            DEPENDS
                "${source}"
                "${ROOT_DIR}/webpack.config.js"
        )
    endif()
endfunction()


function(get_filename_as_target filename out_target)
    string(REPLACE "/" "-" target "${filename}")
    string(REPLACE " " "-" target "${target}")
    set(${out_target} "${target}" PARENT_SCOPE)
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
            COMMENT "Generating ${source}"
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

add_custom_target(templates. ALL DEPENDS ${_generated_templates})
