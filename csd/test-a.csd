<CsoundSynthesizer>
<CsOptions>
-dm0 -n
</CsOptions>
<CsInstruments>

{{csound_macros}}

instr A
    {{log_i_trace}}("%s %d, %d, %d ...", "test", 1, 2, 3)
endin

</CsInstruments>
<CsScore>

i"A" 0 z

</CsScore>
</CsoundSynthesizer>

{{#Cabbage}}
{{/Cabbage}}
