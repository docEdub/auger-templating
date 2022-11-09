cmake_minimum_required(VERSION 3.17)

project("Test")

set(VERBOSE off CACHE BOOL "")
set(VERBOSE_FLAG "")
if(${VERBOSE})
    set(VERBOSE_FLAG "--verbose")
endif()

get_filename_component(ROOT_DIR "${CMAKE_SOURCE_DIR}" ABSOLUTE)

get_filename_component(BUILD_DIR "${CMAKE_BINARY_DIR}" ABSOLUTE)
get_filename_component(TOOLS_DIR "${ROOT_DIR}/tools" ABSOLUTE)
get_filename_component(SRC_DIR "${ROOT_DIR}/src" ABSOLUTE)


add_custom_command(
    OUTPUT "${BUILD_DIR}/.root/src/Cabbage/cabbageTemplateHelper.js"
    WORKING_DIRECTORY "${ROOT_DIR}"
    COMMAND ${CMAKE_COMMAND} -E remove "${BUILD_DIR}/.root/src/Cabbage/cabbageTemplateHelper.js" && npm run webpack
    DEPENDS
        "${SRC_DIR}/Cabbage/cabbageTemplateHelper.ts"
        "${ROOT_DIR}/webpack.config.js"
)


function(get_filename_as_target filename out_target)
    string(REPLACE "/" "_" target "${filename}")
    string(REPLACE " " "-" target "${target}")
    set(${out_target} "${target}" PARENT_SCOPE)
endfunction()

function(add_handlebar_target)
    set(options OPTIONS)
    set(one_value_keywords ONE_VALUE_KEYWORDS)
    set(multi_value_keywords
        HELPER
        JSON
        SOURCES
    )
    cmake_parse_arguments(ARG "${options}" "${one_value_keywords}" "${multi_value_keywords}" ${ARGN})

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
        add_custom_target(${target}_target ALL DEPENDS "${BUILD_DIR}/.root/${source}")
    endforeach()
endfunction()


add_handlebar_target(
    HELPER "src/Cabbage/cabbageTemplateHelper.ts"
    JSON "csd/test.csd.json"
    SOURCES "csd/test.csd"
)
