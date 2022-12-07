<CsoundSynthesizer>
<CsOptions>
-dm0 -n
</CsOptions>
<CsInstruments>

{{csound_macros}}

instr A
    {{log_i_trace}}("%s %d, %d, %d ...", "test trace", 1, 2, 3)
    {{log_i_debug}}("%s %d, %d, %d ...", "test debug", 1, 2, 3)
    {{log_i_info}}("%s %d, %d, %d ...", "test info", 1, 2, 3)
    {{log_i_warning}}("%s %d, %d, %d ...", "test warning", 1, 2, 3)
    {{log_i_error}}("%s %d, %d, %d ...", "test error", 1, 2, 3)
endin

</CsInstruments>
<CsScore>

i"A" 0 1

</CsScore>
</CsoundSynthesizer>

{{#Cabbage}}
{{/Cabbage}}
