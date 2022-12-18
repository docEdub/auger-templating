cmake_minimum_required(VERSION 3.17)

project("Auger")

get_filename_component(ROOT_DIR "${CMAKE_SOURCE_DIR}" ABSOLUTE)
get_filename_component(BUILD_DIR "${CMAKE_BINARY_DIR}" ABSOLUTE)
get_filename_component(BUILD_DEPENDENCIES_DIR "${BUILD_DIR}/.dependencies" ABSOLUTE)
get_filename_component(BUILD_OUTPUT_DIR "${BUILD_DIR}/.output" ABSOLUTE)

set(CsoundTemplateHelpers_RootDir "submodules/CsoundTemplateHelpers")
add_subdirectory("${CsoundTemplateHelpers_RootDir}")

add_csound_templates(
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
        "${CsoundTemplateHelpers_RootDir}/src/cabbageTemplateHelper.ts"
        "${CsoundTemplateHelpers_RootDir}/src/csoundTemplateHelper.ts"
)
