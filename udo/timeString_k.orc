{{includeGuardStart}}

{{include "time_k.orc"}}

opcode timeString_k, S, 0
    kTime = time_k()
    kHours = floor(kTime / 3600)
    kTmp = kTime - (3600 * kHours)
    kMinutes = floor(kTmp / 60)
    kSeconds = floor(kTmp - (60 * kMinutes))
    kMicroseconds = 1000000 * frac(kTime)
    xout sprintfk("%d:%02d:%02d.%06d", kHours, kMinutes, kSeconds, kMicroseconds)
endop

{{includeGuardEnd}}
