cmake_minimum_required(VERSION 3.17)

project("Auger")

get_filename_component(ROOT_DIR "${CMAKE_SOURCE_DIR}" ABSOLUTE)
get_filename_component(BUILD_DIR "${CMAKE_BINARY_DIR}" ABSOLUTE)

add_subdirectory("templateHelpers")

add_custom_commands_for_template_sources(
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
        "templateHelpers/src/cabbageTemplateHelper.ts"
        "templateHelpers/src/csoundTemplateHelper.ts"
)
