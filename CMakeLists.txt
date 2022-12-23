cmake_minimum_required(VERSION 3.17)

project("Auger")

list(APPEND CMAKE_PREFIX_PATH "submodules/CsoundHandlebarHelpers")
find_package(CsoundTemplating REQUIRED)

configure_csound_templates(
    INCLUDE
        "cabbage-core"
)

add_csound_templates(
    SOURCES
        "csd/test-a.csd"
    JSON
        "csd/test-a.json"
        "json/types-a.json"
        "json/types-b.json"
)

add_csound_templates(
    SOURCES
        "csd/test-b.csd"
    JSON
        "csd/test-b.json"
        "json/types-a.json"
        "json/types-b.json"
)

generate_csound_templates()
