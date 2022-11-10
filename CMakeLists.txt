cmake_minimum_required(VERSION 3.17)

project("Test")

set(VERBOSE off CACHE BOOL "")
set(VERBOSE_FLAG "")
if(${VERBOSE})
    set(VERBOSE_FLAG "--verbose")
endif()

function(verbose_message)
    if(${VERBOSE})
        message("${ARGN}")
    endif()
endfunction()

get_filename_component(ROOT_DIR "${CMAKE_SOURCE_DIR}" ABSOLUTE)
get_filename_component(BUILD_DIR "${CMAKE_BINARY_DIR}" ABSOLUTE)
get_filename_component(SRC_DIR "${ROOT_DIR}/src" ABSOLUTE)
get_filename_component(TOOLS_DIR "${ROOT_DIR}/tools" ABSOLUTE)


function(add_custom_command_for_template_helper)
    set(source "${ARGN}")

    if(NOT ${source} IN_LIST _custom_command_template_helper_sources)
        list(APPEND _custom_command_template_helper_sources "${source}")
        set(_custom_command_template_helper_sources ${_custom_command_template_helper_sources} PARENT_SCOPE)

        verbose_message("Adding custom command for \"${source}\".")

        string(REPLACE ".ts" ".js" output "${BUILD_DIR}/.root/${source}")

        add_custom_command(
            OUTPUT "${output}"
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND ${CMAKE_COMMAND} -E remove "${output}" && npm run webpack
            DEPENDS
                "${source}"
                "${ROOT_DIR}/webpack.config.js"
        )
    endif()
endfunction()


function(get_filename_as_target filename out_target)
    string(REPLACE "/" "_" target "${filename}")
    string(REPLACE " " "-" target "${target}")
    set(${out_target} "${target}" PARENT_SCOPE)
endfunction()


function(add_template_target)
    set(options OPTIONS)
    set(one_value_keywords ONE_VALUE_KEYWORDS)
    set(multi_value_keywords
        HELPER
        JSON
        SOURCES
    )
    cmake_parse_arguments(ARG "${options}" "${one_value_keywords}" "${multi_value_keywords}" ${ARGN})

    add_custom_command_for_template_helper("${ARG_HELPER}")

    foreach(source ${ARG_SOURCES})
        add_custom_command(
            OUTPUT "${BUILD_DIR}/.root/${source}"
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${TOOLS_DIR}/buildTemplateFiles.js"
                --build-dir "${BUILD_DIR}"
                --helper-files "${ARG_HELPER}"
                --json-files "${ARG_JSON}"
                --source "${source}"
                ${VERBOSE_FLAG}
            DEPENDS
                "${source}"
                "${TOOLS_DIR}/buildTemplateFiles.js"
                "${BUILD_DIR}/.root/src/Cabbage/cabbageTemplateHelper.js"
        )

        get_filename_as_target("${source}" target)
        add_custom_target("TEMPLATE_TARGET--${target}" ALL DEPENDS "${BUILD_DIR}/.root/${source}")
    endforeach()
endfunction()


add_template_target(
    HELPER "src/Cabbage/cabbageTemplateHelper.ts"
    JSON "csd/test.csd.json"
    SOURCES "csd/test.csd"
)
