{{includeGuardStart}}

{{include "time_i.orc"}}

opcode timeString_i, S, 0
    iTime = time_i()
    iHours = floor(iTime / 3600)
    iTmp = iTime - (3600 * iHours)
    iMinutes = floor(iTmp / 60)
    iSeconds = floor(iTmp - (60 * iMinutes))
    iMicroseconds = 1000000 * frac(iTime)
    xout sprintf("%d:%02d:%02d.%06d", iHours, iMinutes, iSeconds, iMicroseconds)
endop

{{includeGuardEnd}}
