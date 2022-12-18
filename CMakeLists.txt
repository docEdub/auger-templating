cmake_minimum_required(VERSION 3.17)

project("Auger")

get_filename_component(ROOT_DIR "${CMAKE_SOURCE_DIR}" ABSOLUTE)
get_filename_component(BUILD_DIR "${CMAKE_BINARY_DIR}" ABSOLUTE)
get_filename_component(BUILD_DEPENDENCIES_DIR "${BUILD_DIR}/.dependencies" ABSOLUTE)
get_filename_component(BUILD_OUTPUT_DIR "${BUILD_DIR}/.output" ABSOLUTE)

set(CsoundHandlebarHelpers_RootDir "submodules/CsoundHandlebarHelpers")
add_subdirectory("${CsoundHandlebarHelpers_RootDir}")

initialize_csound_handlebar_targets()

add_csound_templates(
    SOURCES
        "csd/test-a.csd"
        "csd/test-b.csd"
    JSON
        "csd/test-a.json"
        "csd/test-b.json"
        "json/types-a.json"
        "json/types-b.json"
)

finalize_csound_handlebar_targets()
