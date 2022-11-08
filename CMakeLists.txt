cmake_minimum_required(VERSION 3.17)

project("Test")

set(HANDLEBAR_JSON "csd/test.csd.json")
set(HANDLEBAR_SOURCES
    "csd/test.csd"
)

get_filename_component(ROOT_DIR "${CMAKE_SOURCE_DIR}" ABSOLUTE)
message("ROOT_DIR = ${ROOT_DIR}")

get_filename_component(BUILD_DIR "${CMAKE_BINARY_DIR}" ABSOLUTE)
get_filename_component(TOOLS_DIR "${ROOT_DIR}/tools" ABSOLUTE)
get_filename_component(SRC_DIR "${ROOT_DIR}/src" ABSOLUTE)


add_custom_command(
    OUTPUT "${BUILD_DIR}/.js/Cabbage/handlebars.js"
    WORKING_DIRECTORY "${ROOT_DIR}"
    COMMAND ${CMAKE_COMMAND} -E remove "${BUILD_DIR}/.js/Cabbage/handlebars.js" && npm run webpack
    DEPENDS
        "${SRC_DIR}/Cabbage/handlebars.ts"
        "${ROOT_DIR}/webpack.config.js"
)


function(get_filename_as_target filename out_target)
    message("filename = ${filename}")
    string(REPLACE "/" "_" target "${filename}")
    string(REPLACE " " "-" target "${target}")
    set(${out_target} "${target}" PARENT_SCOPE)
endfunction()


function(add_handlebar_target)
    set(options OPTIONS)
    set(one_value_keywords ONE_VALUE_KEYWORDS)
    set(multi_value_keywords
        HANDLEBAR_JSON
        HANDLEBAR_SOURCES
    )
    cmake_parse_arguments(ARG "${options}" "${one_value_keywords}" "${multi_value_keywords}" ${ARGN})

    foreach(source ${ARG_HANDLEBAR_SOURCES})
        add_custom_command(
            OUTPUT "${BUILD_DIR}/${source}"
            WORKING_DIRECTORY "${ROOT_DIR}"
            COMMAND node "${TOOLS_DIR}/buildTemplateFiles.js" "${BUILD_DIR}" "${ARG_HANDLEBAR_JSON}" "${source}"
            DEPENDS
                "${source}"
                "${TOOLS_DIR}/buildTemplateFiles.js"
                "${BUILD_DIR}/.js/Cabbage/handlebars.js"
        )

        get_filename_as_target("${source}" target)
        message("target = ${target}")
        add_custom_target(${target}_target ALL DEPENDS "${BUILD_DIR}/${source}")
    endforeach()
endfunction()

add_handlebar_target(HANDLEBAR_JSON ${HANDLEBAR_JSON} HANDLEBAR_SOURCES ${HANDLEBAR_SOURCES})
