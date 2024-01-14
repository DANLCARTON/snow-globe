const generateRandomPattern = (array) => {
    const length = Math.ceil(Math.random()*15);
    var randomPattern = ""
    for (let i = 0; i <= length; i++) {
        const letter = Math.floor(Math.random()*8)
        randomPattern += array[letter]
    }
    return randomPattern
}

const FRules = {
    "patternF1" : "",
    "patternF2" : "F+F-F-F+F",
    "patternF3" : "F*F*F*F*F*F/F",
    "patternF4" : "F-F*F-F",
    "patternF5" : "F/F**FF**F/F/F",
    "patternF6" : "F/FF*F**F/F*F*F**F/FF*F",
    "patternF7" : "-F+F+F+F+F+F+F+F+F+F+F-F",
    "patternF8" : "F-F+F+F-F",
    "patternF9" : "F/F*F*F/F*F*F/F*F*F/F*F*F/F*F*F/F*F/F",
    "patternF10" : "FFF/F+*FF*FF+*F/FFF*FF",
    "patternF11" : "*FF-/FF+*FF",
    "patternF12" : "*FFF/FF/FF",
    "patternF13" : "-F*FF/F/F/FF*F*F*FF/F+F",
    "patternF14" : "F-F+F*+F-F-F+*F+F-F*F",
    "randomPatternF" : generateRandomPattern(["F", "F", "F", "F", "+", "-", "*", "/"]),
}

const plusRules = {
    "patternPlus1": "",
    "randomPatternPlus": generateRandomPattern(["F", "+", "+", "+", "+", "-", "*", "/"])
}

const minusRules = {
    "patternMinus1": "",
    "randomPatternMinus": generateRandomPattern(["F", "+", "-", "-", "-", "-", "*", "/"])
}

const timesRules = {
    "patternTimes1": "",
    "randomPatternTimes": generateRandomPattern(["F", "+", "-", "*", "*", "*", "*", "/"])
}

const divRules = {
    "patternDiv1": "",
    "randomPatternDiv": generateRandomPattern(["F", "+", "-", "*", "*", "*", "*", "/"])
}

export  {FRules, plusRules, minusRules, timesRules, divRules}
