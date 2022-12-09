<CsoundSynthesizer>
<CsOptions>
{{CsdOptionsCore}}
</CsOptions>
<CsInstruments>

sr = {{sr}}
kr = {{kr}}

{{CsdOrcGlobalCore}}

instr A
    {{logTrace_i}}("%s %d, %d, %d ...", "test trace", 1, 2, 3)
    {{logDebug_i}}("%s %d, %d, %d ...", "test debug", 1, 2, 3)
    {{logInfo_i}}("%s %d, %d, %d ...", "test info", 1, 2, 3)
    {{logWarning_i}}("%s %d, %d, %d ...", "test warning", 1, 2, 3)
    {{logError_i}}("%s %d, %d, %d ...", "test error", 1, 2, 3)

    {{logTrace_k}}("%s %d, %d, %d ...", "test trace", 1, 2, 3)
    {{logDebug_k}}("%s %d, %d, %d ...", "test debug", 1, 2, 3)
    {{logInfo_k}}("%s %d, %d, %d ...", "test info", 1, 2, 3)
    {{logWarning_k}}("%s %d, %d, %d ...", "test warning", 1, 2, 3)
    {{logError_k}}("%s %d, %d, %d ...", "test error", 1, 2, 3)
endin

</CsInstruments>
<CsScore>

{{CsdScoGlobalCore}}

i"A" 0 0.031

</CsScore>
</CsoundSynthesizer>

{{Cabbage}}
