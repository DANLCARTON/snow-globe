const generateRandomAxiom = () => {
    const array = ["F", "+", "-", "*", "/"]
    const length = Math.ceil(Math.random()*500)
    var randomAxiom = ""
    for (let i = 0; i <= length; i++) {
        const letter = Math.floor(Math.random()*5)
        randomAxiom += array[letter]
    }
    return randomAxiom
}

const axioms = {
    "axiom1": "F",
    "axiom2": "F-F+*F/F",
    "axiom3": "F[-F]F[+F]F",
    "axiomGPT100" : "F*F*F/F/F*F/F/F+F/F/F*F/F/F+F/F/F*F/F/F+F/F/F*F/F/F+F/F/F*F/F/F+F/F/F*F/F/F+F/F/F*F/F/F+F/F/F*F/F/F+",
    "axiomGPT200" : "F++--FF+F+FF-FF/FFFF/F/+F-F/F+F/FFF/F+/FF/F/FFF/F/F/F+F/F/F+FFF/F+F/F/FF/F/F+F/F/FFF/F+F/F/FFF/F/F+F/F/F+FFF/F+F/F/FF/F/F+F/F/FFF/F+F/F/FF/F/F+F/F/FFF/F+F/F/FF/F/F+F/F/FFF/F+F/F/FF/F/F+F/F/FFF/F+F/F/F",
    "axiomGPT300" : "F+-*F/FF*F+F*-*F/F*FF*+FF*FF-+F*FF/F-F*F*F-FF*F*FF+*F-FF/F+F/FF-F/F-FF*F-FF/F-FF-F-FF/F*F/FF/F*F+F/FF*F-F*FF+F*FF/FF*F/FF+FF/FF*F*F*FF/F*F/FF/FF+FF/F/F-F/F-F-FF+F+F/F*FF/FF/F*F/FF*F/FF/F*F/FF*F*F/FF+FF/F/F*FF+F/FF*F/FF*F/FF*F/FF/F*F+F/FF*F/F*F+F+F/FF*F/FF*F/FF*F/FF*F/FF*F+F*F/FF/F*F+F+F*F/FF/F*F*FF/",
    "axiomGPT400" : "F+FF-FF*F/FF*+FF/F-F*F*FF/F*F/F+FF-FF/FF+F*F/F/F-F/F*FF/F-F*F*F/FF*FF-F/F-F/F*F+FF/F+FF*FF/FF/F*F/F*FF-F*F/F/F*F/FF/F+FF-F/F+F/F/F*FF/FF-F+F/F/FF*F/FF/F*FF*F*F/F*F/F*FF/FF*F*F*F/FF-F/F*F/FF+F/FF/F/F*F/FF/F/F*FF-F/F/F*F/FF/F*F+F/FF/FF+F/F/F*F/FF/F*FF/FF/F+F/F+F/F*F/F/FF/F/F*FF/FF+F*F/F*F/FF*F+F/F*F/F/FF+F/FF/F+F/F/F*F/FF/F/F*F/F+F/FF/F*FF-F/F/F+F/F/F*F/F+F+F/FF+F/FF*F+F+F/FF/F+F/FF/FF*F+F+F/FF/F*F/",
    "axiomGPT500" : "FF+--*FF+*F-FF*F/FF+*FF+FF/FF+FF*F/FF*FF+F-FF*F/F/F/F/F/F/F/FF*F/FF*FF+F/F/F/FF+*F/F/F*FF/F/F/F/F/FF+F*FF/FF*F/F/F/F/F/F/FF/F/FF/F/F/FF+F/FF/F/F/FF*F/F/F/F/FF+*FF/FF/FF/F/F/F/F/FF*F/F/FF/FF/F/FF+*FF+F+F/FF/F/F/F/F/F/F/F/FF/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F/F",
    "axiomGPT852" : "F*+*-*F/+F+F-FFF+FF/F*-*+F+F*+F+*F*-*+F-F*-*F+F*-*+F*+FF/+F/F-+*F++F/F-+FF-F/FF-F/FF/F+F/FF/F-F/FF/+F-F+*F*+F-F/FF/F-+FF*-*+F/+F/+*F-*F/F+FF/+F+F/+F/F+F*+FF/F-+*F/F-F/+F+F/F-F/FF*+FF/F-+FF/F+F-+*F-F*-*F-F+F/F*-*F/F+F/+F/FF+F/FF/F*-*F/+F/+F/F+F*+FF/+F+F/+F/F+F*+FF/F-+*F/F-F/+F+F/F-F/FF*+FF/F-+FF/F+F-+*F-F*-*F-F+F/F*-*F/F+F/+F/FF+F/FF/F*-*F/+F/+F/F+F*+FF/+F+F/+F/F+F*+FF/F-+*F/F-F/+F+F/F-F/FF*+FF/F-+FF/F+F-+*F-F*-*F-F+F/F*-*F/F+F/+F/FF+F/FF/F*-*F/+F/+F/F+F*+FF/+F+F/+F/F+F*+FF/F-+*F/F-F/+F+F/F-F/FF*+FF/F-+FF/F+F-+*F-F*-*F-F+F/F*-*F/F+F/+F/FF+F/FF/F*-*F/+F/+F/F+F*+FF/+F+F/+F/F+F*+FF/F-+*F/F-F/+F+F/F-F/FF*+FF/F-+FF/F+F-+*F-F*-*F-F+F/F*-*F/F+F/+F/FF+F/FF/F*-*F/+F/+F/F+F*+FF/+F+F/+F/F+F*+FF/F-+*F/F-F/+F+F/F-F/FF*+FF/F-+FF/F+F-+*F-F*-*F-F+F/F*-*F/F+F/+F/FF+F/FF/F*-*F/+F/+F/F+F*+FF/+F+F/+F/F+F*+FF/F-+*F/F-F/+F+F/F-F/FF*+FF/F-+FF/F+F-+*F-F*-*F-F+F/F*-*F/F+F/+F/FF+F/FF/F*-*F/+F/+F/F+F*+FF/+F+F/+F/F+F*+FF/F-+*F/F-F/+F+F/F-F/FF*+FF/F-+FF/F+F-+*F-F*-*F-F+F/F*-*F/F+F/+F/FF+F/FF/F*-*F/+F/+F/F+F*+FF/+F+F/+F/F+F*+FF/F-+*F/F-F/+F+F/F-F/FF*+FF/F-+FF/F+F-+",
    "axiomBard100" : "+F++F++F*F+F-**/F-F-F*F++F-**F+*F*-F+**F--F-F+*++F++F-F-F-FF++F+F*-F-*FF-F**F+F-F+*F-**F-FF-F**F--FF",
    "axiomBard200" : "---F****+/F+F/*///+FF/F++**//++*///+*****FFF-+/--*F-*-F--*--++FF++*F+FF-+/+*+/+F+-++*/FFF/++F/-/-+/*F+/F*/F-/F+*+*+-*+F-F//-**F/F+F++F--*/***+--F+F//+//*/--+FF-//+F--+**F-/++-F*F/--/F+FF--FF-+*-F--/FF",
    "axiomBard300" : "F+/F+-+*/++F-/*+-+F*FF*F++**--F+/F+F+FF/F+F/+**-+-+F+FF++F+**F-F+*-F+F+-*/F+F+-*/F-F/+F+/F+F++*F++F+-FF+F+F*-*/F++/F+F+F+F/-F+F+F*-F+F+-*/F+F+-*/F-F/+F+/F+F++*F++F+-FF+F+F*-*/F++/F+F+F+F/-F+F+F*-F+F+-*/F+F+-*/F-F/+F+/F+F++*F++F+-FF+F+F*-*/F++/F+F+F+F/-F+F+F*-F+F+-*/F+F+-*/F-F/+F+/F+F++*F++F+-FF+F+F*",
    "axiomBard400" : "/+F+/++*-F-/F---/--//+//-F-F-/---//+F++F**/F-/F/F**F+/+++-FF-F++-/-/F+/F+FFF+///F/+-+FF/+*-/FF-F-/FF+///-+F/**+/F-++/F++/-FF-+-/-F/--F/+//+F-+F+/+-///++/F+F**/+F--/--+**//++FFFFF-+-///-F/-F+--+F--/F---/+//FFFFF+//+/F-+F++F+F-+F+F-+/FF+F++/-++/+/F//F++++-F-//FF/F-FFF+/F/FF-F/F-+-+F//+FF/+*-++-+/+F-F-/++F/---+--++-+-F+F-F-F/-/F+/+--+-+-*F+-/-++//FF///-F+++//-+/+-F-----+FF/-F/+F-FF+FF+-++/F+/-FF-/F*/",
    "axiomBard500" : "*F+/-*/++//*-**++*F/F**/-++-+/F/+/++F/-+///FF-//+F/+/-++F+**--F/+**/-F/+/FF*-/-F-FF*--*-/F--//F-F*-+/+*-F-F**/F-*+F-F///---/-F*-+*-//+-F--F--/F/-/*-+*+**/*-F-/++F/*F*FF+-FF++**/*/*-*/++/+/--/F+-+***-*+-/F****-*/F**F*-*F-F-*/+*F*+-*F+-F+F+F*F-+*+**/-**-F-*-///-F/-*/*/FFFF-+FFF//F+-F--FF**+++-*++*/+*//F*+-+/*-+/+-+F+//F//FFF+-FF/+---F/+F*/F+-+/FF+---F**F-///*//+-+++**F*F/F-***//-*-F+**+*FF*+F*FF+-F/---FF/+*F+-F-F-+/+*FF*//+-*F-/FFF-+--/F/FF--F/F*F/-*+**+*++/F/*/+F/*/-*F+*/-F+-FF*/-/*+----F---***F-",
    "randomAxiom": generateRandomAxiom()
}

export default axioms