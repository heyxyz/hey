import easyinvoice, { type InvoiceData } from "easyinvoice";
import fs from "node:fs";

// Only Update these values
const forYogi = false;
const month = "9";
const year = "2024";

const lastInvoiceNumber = 5568;
const amountPerAccount = 250;
const accounts = [
  "kklow",
  "33336b",
  "durfrejaschard1977",
  "livias",
  "sandyj74",
  "mabelmy",
  "atlasathorne",
  "zazuva",
  "mati8",
  "eth1010",
  "luxusq",
  "nina1983",
  "wolfenstein",
  "yevgeni",
  "ambercook9",
  "tyler121",
  "breezybutterfly",
  "roomteach",
  "97876",
  "snare",
  "yangenxi",
  "josephmiller",
  "jinxihenian",
  "evgeniya210983",
  "yytuiop",
  "jaydenwq",
  "waitress",
  "thurseday",
  "prosatsasle1986",
  "dsfsdg74h1",
  "ferrovial",
  "roronoa_zoro",
  "sofiarochi",
  "ssiduyiq",
  "megangraham",
  "grimgor",
  "uncanny",
  "maskm",
  "pksingh",
  "cryptoanshu",
  "sparklingstar",
  "xavinavarrete",
  "dodoxixi",
  "visioneth",
  "octobull",
  "titto",
  "23251",
  "inspirations",
  "ssahil",
  "2sadzxc",
  "ijerru",
  "roisatulzfitrie",
  "engrishola",
  "asfa4587",
  "aboyhudson",
  "cryptoeddie",
  "cryptostifler",
  "likeyoujj",
  "1moon",
  "kinnylewa",
  "mindnighbamul1976",
  "eeeeo",
  "21566",
  "eeee0e",
  "dheivaer",
  "slender",
  "flemingz",
  "brotatohuntero",
  "dames",
  "shereedarus",
  "ooo0000",
  "eight5555",
  "yngnini",
  "0xniu",
  "makartnee",
  "oeghoe",
  "miniban",
  "spruce",
  "zontron",
  "jianxi",
  "exploerlys",
  "aaawt",
  "kdas6",
  "917788",
  "starx",
  "rouez",
  "muxlisa",
  "londonconcours",
  "husbandremove",
  "pushreport",
  "aaaau",
  "lilygraysont",
  "uryivtixiy",
  "zyxy012",
  "tooook",
  "danieleth",
  "naimambaeva",
  "dimplesq",
  "brianarmstronghht",
  "edgez",
  "malletisra",
  "3ee24",
  "cryptofanatic7",
  "sophiapp",
  "zyxy013",
  "hedea",
  "tfuhx",
  "reneon",
  "1ad78",
  "gobucs1977ph",
  "orooro",
  "36968",
  "wenrun8",
  "0xtutankhamun",
  "usclassicautos",
  "gothh",
  "eternyx",
  "illustrarch",
  "fangxue",
  "84856",
  "87981",
  "king1955",
  "cryptolurk",
  "anarchycrypto",
  "aiden8",
  "yuwen",
  "hayesmcdole",
  "passages",
  "carshi",
  "squirreler",
  "98esdgs",
  "manekmohsin",
  "bid0n",
  "gallon_of_water",
  "g98szb6bmf",
  "townfilm",
  "youmo",
  "coo1post",
  "hitman4an",
  "progrdessive",
  "authormother",
  "54865",
  "uduffy",
  "monochain",
  "klbgvlv",
  "starseeker",
  "personpicture",
  "sweetrapture",
  "ynopl",
  "twinex",
  "mhant",
  "ohmybuddhabtc",
  "minihyuns",
  "eruejw",
  "butie",
  "jikolao",
  "misan01",
  "goldendonkey",
  "cacac",
  "umesh99",
  "nipa2",
  "6xxxx",
  "byl56",
  "bridgetb",
  "charlotte_jackson",
  "eeeepv2",
  "0xperspolis",
  "farah",
  "kabbalah",
  "don1z",
  "lishit",
  "wallet31",
  "petipa",
  "yingkong",
  "kaceky",
  "cs2player",
  "odasm",
  "james_thomas",
  "tomars",
  "202255",
  "tractorrope",
  "tanarchy",
  "throughoutproperty",
  "mirageflux53",
  "mysticweaver",
  "rx7fd3s1991",
  "bxkxm",
  "tusi5",
  "bernarddepo",
  "bngfh",
  "homensdefiodental",
  "zon3tex",
  "atgeditorial",
  "narrows",
  "168r1ghe",
  "syshj",
  "sk24k",
  "fkdp55",
  "mujer",
  "mfarooqbukhsh",
  "useme",
  "danielrt",
  "maidendtr",
  "geolorolo1982",
  "divyasingh123",
  "gathers",
  "876g7",
  "politicalbudget",
  "hilldelli",
  "olimon",
  "burgesss",
  "glizzziemcguire",
  "aponprodiz1971",
  "i6nake9",
  "eeeeh",
  "horcus",
  "tauri",
  "isabella_reyes",
  "madelinelucy",
  "yalisandameng",
  "ramtruckswgt",
  "harrisonnyyr",
  "viseman",
  "jeffrollbama",
  "whichcall",
  "vextron",
  "peshko",
  "chile",
  "0xjackson",
  "wuy82ee",
  "centric",
  "knight651",
  "blytheyn",
  "vexcore",
  "liyueyue",
  "kordo",
  "ellelewis",
  "sbn9300",
  "arcadiaflame",
  "sandygg",
  "xiangfa",
  "polskyrono",
  "ymption",
  "tonsor83",
  "redption",
  "bigluck",
  "alexandermartin",
  "annaanna",
  "wssss2",
  "56148",
  "0days",
  "jerryr",
  "ceigartempte1979",
  "9dqqqq9",
  "lunarwhisper",
  "yyzxzys",
  "qqlaibeijingcun",
  "wow_howareu",
  "tttt3",
  "fgsf4",
  "skyninja",
  "jiangj",
  "clarasa",
  "hvenly_horizon",
  "paigu",
  "sad845xc1",
  "josephph",
  "cryptolifestyle",
  "storify",
  "chandubhai",
  "possibleinside",
  "fedotova",
  "fdghdt",
  "unhat",
  "misdohadwq",
  "agneslove",
  "broadcasting",
  "sunsun",
  "kawaiiechoes",
  "voidshade",
  "ipolly",
  "pinkypink",
  "nnnyw",
  "ehnerlarisselcasse",
  "hofmann",
  "eccccaz",
  "travelc",
  "meattaworqui1977",
  "xabote",
  "regillmenni1981",
  "neha007",
  "redbullracing",
  "zhongshengjieku",
  "ddddck",
  "88u88",
  "urbannomad33",
  "managed",
  "herscheln",
  "missing",
  "nationenvironment",
  "violetoi",
  "xenders",
  "elinakisel",
  "piesavoury",
  "lenivec",
  "danielle573",
  "kaifarek",
  "indulges",
  "ashy2002",
  "elijahwodehous",
  "folan",
  "dongjing",
  "chloe_martin",
  "0x3561924",
  "faitho",
  "wendjy",
  "6qqqquk",
  "adcryp",
  "rambikla",
  "miavossp",
  "btcb016",
  "19mlt19",
  "osaniwqhdqw",
  "thomasbcurtis",
  "traxanh",
  "solbug",
  "merlehgf",
  "erskifne",
  "ingemarsamson",
  "boran",
  "adits",
  "davidwhite",
  "thejupiter",
  "mystee",
  "sunnysunny",
  "xyz777",
  "sketchbooke",
  "silasis",
  "snekaiz",
  "organicds",
  "kuala",
  "wentaowulue",
  "semuve",
  "68mmmmc",
  "mtryy",
  "gabsss",
  "jackwuliao",
  "beamy",
  "chipssister",
  "feizhong",
  "thiss",
  "thedoctor",
  "caffv",
  "tinini",
  "chai_358",
  "phynaelly",
  "rrrrepe",
  "underr",
  "gsofter",
  "creat",
  "albaerti",
  "rbnsk",
  "quakely",
  "balboa",
  "laity",
  "yoouip",
  "kanecod",
  "danwichildtimb1974",
  "jbcarsng",
  "trompakeate1978",
  "john15",
  "mr800",
  "purchticfieros1987",
  "bitburst",
  "x5k7ccvn3bqw",
  "tammywu",
  "buildingme",
  "sacike",
  "secondlm",
  "kaidiya",
  "lacha",
  "clisitinaasa",
  "itgel",
  "oliverd",
  "naxia",
  "summaries",
  "base1",
  "normanmh",
  "sebaflores",
  "vgppppu",
  "siempre_lo_mejor",
  "alexander5",
  "intrigant",
  "looke",
  "denis_bit",
  "baisuishan",
  "qingxu",
  "teeen",
  "alhamdulillahzks",
  "svet2",
  "wasdgg",
  "demiurge",
  "lerjaas",
  "rondo12",
  "lwilliams",
  "dynamix",
  "aaads5512",
  "dapearl",
  "shanshuihua",
  "coinfam",
  "shidream",
  "bbogu",
  "piotrnowak",
  "instituting",
  "niu42043",
  "wawazaki",
  "evanluthra",
  "mihhby",
  "qianshanzhi",
  "vivivixx3",
  "ideaher",
  "bushido1979",
  "tortoon",
  "addisonwilson",
  "galyz",
  "xal3dor",
  "lindalouise",
  "chaosriftd",
  "nnncr",
  "xfactor",
  "gocci3",
  "happu",
  "longterm",
  "cc8cc",
  "determined",
  "successsame",
  "music1qu",
  "bodybuilder",
  "midgeabean",
  "shitingting",
  "xavierayvette",
  "rickyt",
  "valianter",
  "nchante",
  "zdcccc",
  "opkka",
  "rubbry",
  "iambbrone",
  "g2229",
  "qilan",
  "kkkxo",
  "cccinnamon",
  "omardd",
  "stspts",
  "duoluo",
  "nanamartin1",
  "lunappyyuig",
  "anthonyfc",
  "daniel_johnson",
  "songw",
  "gwei7",
  "onceimagine",
  "hqqqq7",
  "johnson3",
  "yesdescribe",
  "hamidhp0580",
  "julianlilyff",
  "vicrhal",
  "newoh",
  "starwhisper",
  "lastoneking",
  "stedy",
  "jeuse",
  "suiaigc",
  "vzqs9b59wa",
  "oliviaharris",
  "harryq",
  "michiesponjoso",
  "pqfstiktok",
  "sahindah",
  "mz707093",
  "2shank",
  "cuminhg",
  "3kkkk",
  "wholecoiner",
  "whatisresell",
  "ewenda",
  "shonenstorm",
  "maksimryzhikovv",
  "swiper",
  "madisongarcia",
  "oliverella",
  "migra",
  "ronse0",
  "85472",
  "g1333",
  "euapnsz",
  "pels_0",
  "ethseoul",
  "trepit",
  "joshua3",
  "andrewtongywxa",
  "gaibian",
  "agogo",
  "valenciacordoba",
  "membertoken",
  "votov",
  "deathndhorror",
  "dsf3cxvxc",
  "tracyhancock50",
  "levid",
  "fangh",
  "reqiqiu",
  "ponchan",
  "violete",
  "cilosesrodc1986",
  "diky_cjr",
  "0xhsulf",
  "hqporto",
  "jaklopert",
  "visionize",
  "ella_garcia",
  "aadaddxx",
  "htaaaam",
  "p38pppp",
  "excite",
  "zenaro",
  "fleetcher",
  "budiaoshui",
  "slcbieber",
  "ssss6",
  "myfor",
  "terraincognito",
  "yuuuuuuuuu",
  "teachyeah",
  "rscott",
  "vaultvoyage",
  "kimchristine",
  "xixi1256",
  "jacobos",
  "nhixxx",
  "mokamoka",
  "cbwmc",
  "seraphinagrace",
  "maide",
  "mazurlenakiss",
  "dcb65",
  "diverting",
  "32248",
  "fredanny",
  "2ssss2",
  "00btc00",
  "errer",
  "8rou22",
  "mylayer0",
  "spicyperspectiv",
  "op155",
  "zeepr",
  "accajendast1981",
  "nardez",
  "leoresearch",
  "celestrix",
  "sophie_xdt",
  "blakelala",
  "xxxisgood",
  "rename",
  "sagor42077",
  "narciss",
  "dormitories",
  "cortelmo",
  "eatonb",
  "serenn",
  "networ",
  "momyy",
  "barstart",
  "fomodaotgjuerdfg",
  "a41v4v",
  "skinexdisum1974",
  "bbbb3q9",
  "crompton",
  "axlion",
  "kalashnikov",
  "kongxin",
  "radiantstorm",
  "owen9l",
  "8d489de",
  "celestineslothsociety",
  "congte",
  "bookofchess",
  "frostvanguardv",
  "erroremon404",
  "bmwusagmh",
  "aldrichd",
  "holdcrypto",
  "rrrnw",
  "duxaes",
  "maudsaxton",
  "aidenwhite",
  "berating",
  "flashstaking"
];
// Only Update these values

const data: InvoiceData = {
  apiKey: "PntktbOaJHXsR5272jJImlN5KW6RbXp0KL646ojBoM2SS5Set5Yh45pPPJ3DrON9",
  mode: "production",
  images: { logo: "https://hey-assets.b-cdn.net/images/app-icon/0.png" },
  sender: {
    company: forYogi ? "Yoginth" : "Sagar",
    address: `HD-${forYogi ? "322" : "323"}, WeWork Latitude, 10th floor, RMZ Latitude Commercial, Bellary Road, Hebbal, Near Godrej Apt`,
    zip: "560024",
    city: "Bangalore, Karnataka",
    country: "India"
  },
  translate: { number: "Invoice Number" },
  products: [
    { description: "Hey Account", price: amountPerAccount, quantity: "1" }
  ],
  bottomNotice: `GSTIN: ${forYogi ? "29AYKPY4219R1Z8" : "29JZXPS2474H1Z6"}`,
  settings: {
    currency: "INR",
    taxNotation: "GST",
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25
  }
};

const generateInvoice = async () => {
  let invoiceNumber = lastInvoiceNumber;

  for (const account of accounts) {
    const dueDate = `${month}/${Math.floor(Math.random() * 30) + 1}/${year}`;
    const company = account.toUpperCase().replaceAll("_", " ");

    const injectedData = {
      ...data,
      client: { company },
      information: { number: invoiceNumber.toString(), dueDate }
    };

    const currentInvoiceNumber = invoiceNumber;

    try {
      const result = await easyinvoice.createInvoice(injectedData);
      const pdfBuffer = Buffer.from(result.pdf, "base64");
      fs.writeFileSync(`generated/${currentInvoiceNumber}.pdf`, pdfBuffer);
      console.log(`Generated invoice ${currentInvoiceNumber} for ${account}`);
    } catch (error) {
      console.error(
        `Error generating invoice ${currentInvoiceNumber} for ${account}:`,
        error
      );
    }

    invoiceNumber++;
  }
};

generateInvoice();
