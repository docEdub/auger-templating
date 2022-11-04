cmake_minimum_required(VERSION 3.17)

project("Test")

get_filename_component(ROOT_DIR "${CMAKE_SOURCE_DIR}/.." ABSOLUTE)
message(ROOT_DIR "${ROOT_DIR}")

set(file_to_compile "${CMAKE_BINARY_DIR}/test.csd")

add_custom_command(
    OUTPUT "${file_to_compile}"
    WORKING_DIRECTORY ${ROOT_DIR}
    COMMAND node ./scripts/build.js test.csd test.csd.json
    DEPENDS "../csd/test.csd" "../csd/test.csd.json" "../scripts/build.js" "../webpack.config.js"
)

string(REPLACE "/" "_" target_name "${file_to_compile}")
string(REPLACE " " "-" target_name target_name)

add_custom_target(
    ${target_name} ALL
    DEPENDS "${file_to_compile}"
)
