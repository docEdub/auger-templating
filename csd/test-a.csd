<CsoundSynthesizer>
<CsOptions>
{{CsOptions}}
</CsOptions>
<CsInstruments>

sr = {{sr}}
kr = {{kr}}

{{CsInstruments}}

instr A
    {{LogTrace_i}}("%s %d, %d, %d ...", "test trace", 1, 2, 3)
    {{LogDebug_i}}("%s %d, %d, %d ...", "test debug", 1, 2, 3)
    {{LogInfo_i}}("%s %d, %d, %d ...", "test info", 1, 2, 3)
    {{LogWarning_i}}("%s %d, %d, %d ...", "test warning", 1, 2, 3)
    {{LogError_i}}("%s %d, %d, %d ...", "test error", 1, 2, 3)

    {{LogTrace_k}}("%s %d, %d, %d ...", "test trace", 1, 2, 3)
    {{LogDebug_k}}("%s %d, %d, %d ...", "test debug", 1, 2, 3)
    {{LogInfo_k}}("%s %d, %d, %d ...", "test info", 1, 2, 3)
    {{LogWarning_k}}("%s %d, %d, %d ...", "test warning", 1, 2, 3)
    {{LogError_k}}("%s %d, %d, %d ...", "test error", 1, 2, 3)
endin

</CsInstruments>
<CsScore>

{{CsScore}}

i"A" 0 0.031

</CsScore>
</CsoundSynthesizer>

{{Cabbage}}
