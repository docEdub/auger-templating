cmake_minimum_required(VERSION 3.17)

project("Test")

get_filename_component(ROOT_DIR "${CMAKE_SOURCE_DIR}" ABSOLUTE)
message(ROOT_DIR "${ROOT_DIR}")

get_filename_component(BUILD_DIR "${CMAKE_BINARY_DIR}" ABSOLUTE)
get_filename_component(SRC_DIR "${ROOT_DIR}/src" ABSOLUTE)


function(add_handlebar_target)
    set(options OPTIONS)
    set(one_value_keywords ONE_VALUE_KEYWORDS)
    set(multi_value_keywords
        HANDLEBAR_TEMPLATES
        SYNTH_PLUGIN_SOURCES
        STANDALONE_SOURCES
        PLAYBACK_SOURCES
    )
    cmake_parse_arguments(ARG "${options}" "${one_value_keywords}" "${multi_value_keywords}" ${ARGN})
endfunction()


add_custom_command(
    OUTPUT "${BUILD_DIR}/cabbageHandlebars.js"
    WORKING_DIRECTORY "${ROOT_DIR}"
    COMMAND ${CMAKE_COMMAND} -E remove "${BUILD_DIR}/cabbageHandlebars.js" && npm run webpack
    DEPENDS
        "${SRC_DIR}/cabbageHandlebars.ts"
        "${ROOT_DIR}/webpack.config.js"
)

set(file_to_compile "${CMAKE_BINARY_DIR}/test.csd")

add_custom_command(
    OUTPUT "${file_to_compile}"
    WORKING_DIRECTORY "${ROOT_DIR}"
    COMMAND node ./scripts/build.js "${ROOT_DIR}/csd/test.csd" "${ROOT_DIR}/csd/test.csd.json"
    DEPENDS
        "${ROOT_DIR}/csd/test.csd"
        "${ROOT_DIR}/csd/test.csd.json"
        "${ROOT_DIR}/scripts/build.js"
        "${BUILD_DIR}/cabbageHandlebars.js"
)

string(REPLACE "/" "_" target_name "${file_to_compile}")
string(REPLACE " " "-" target_name target_name)

add_custom_target(
    ${target_name}_target ALL
    DEPENDS "${file_to_compile}"
)
