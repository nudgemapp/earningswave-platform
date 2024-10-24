import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NASDAQcompanies = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
  },
  {
    symbol: "GOOG",
    name: "Alphabet Inc.",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
  },
  {
    symbol: "META",
    name: "Meta Platforms, Inc.",
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
  },
  {
    symbol: "AVGO",
    name: "Broadcom Inc.",
  },
  {
    symbol: "COST",
    name: "Costco Wholesale Corporation",
  },
  {
    symbol: "NFLX",
    name: "Netflix, Inc.",
  },
  {
    symbol: "ASML",
    name: "ASML Holding N.V.",
  },
  {
    symbol: "TMUS",
    name: "T-Mobile US, Inc.",
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices, Inc.",
  },
  {
    symbol: "AZN",
    name: "AstraZeneca PLC",
  },
  {
    symbol: "PEP",
    name: "PepsiCo, Inc.",
  },
  {
    symbol: "LIN",
    name: "Linde plc",
  },
  {
    symbol: "CSCO",
    name: "Cisco Systems, Inc.",
  },
  {
    symbol: "ADBE",
    name: "Adobe Inc.",
  },
  {
    symbol: "TXN",
    name: "Texas Instruments Incorporated",
  },
  {
    symbol: "QCOM",
    name: "QUALCOMM Incorporated",
  },
  {
    symbol: "ISRG",
    name: "Intuitive Surgical, Inc.",
  },
  {
    symbol: "AMGN",
    name: "Amgen Inc.",
  },
  {
    symbol: "INTU",
    name: "Intuit Inc.",
  },
  {
    symbol: "PDD",
    name: "PDD Holdings Inc.",
  },
  {
    symbol: "CMCSA",
    name: "Comcast Corporation",
  },
  {
    symbol: "AMAT",
    name: "Applied Materials, Inc.",
  },
  {
    symbol: "ARM",
    name: "Arm Holdings plc",
  },
  {
    symbol: "BKNG",
    name: "Booking Holdings Inc.",
  },
  {
    symbol: "HON",
    name: "Honeywell International Inc.",
  },
  {
    symbol: "SNY",
    name: "Sanofi",
  },
  {
    symbol: "VRTX",
    name: "Vertex Pharmaceuticals Incorporated",
  },
  {
    symbol: "PANW",
    name: "Palo Alto Networks, Inc.",
  },
  {
    symbol: "MU",
    name: "Micron Technology, Inc.",
  },
  {
    symbol: "ADP",
    name: "Automatic Data Processing, Inc.",
  },
  {
    symbol: "ADI",
    name: "Analog Devices, Inc.",
  },
  {
    symbol: "GILD",
    name: "Gilead Sciences, Inc.",
  },
  {
    symbol: "SBUX",
    name: "Starbucks Corporation",
  },
  {
    symbol: "MELI",
    name: "MercadoLibre, Inc.",
  },
  {
    symbol: "REGN",
    name: "Regeneron Pharmaceuticals, Inc.",
  },
  {
    symbol: "LRCX",
    name: "Lam Research Corporation",
  },
  {
    symbol: "INTC",
    name: "Intel Corporation",
  },
  {
    symbol: "MDLZ",
    name: "Mondelez International, Inc.",
  },
  {
    symbol: "KLAC",
    name: "KLA Corporation",
  },
  {
    symbol: "EQIX",
    name: "Equinix, Inc.",
  },
  {
    symbol: "CTAS",
    name: "Cintas Corporation",
  },
  {
    symbol: "ABNB",
    name: "Airbnb, Inc.",
  },
  {
    symbol: "PYPL",
    name: "PayPal Holdings, Inc.",
  },
  {
    symbol: "CME",
    name: "CME Group Inc.",
  },
  {
    symbol: "CEG",
    name: "Constellation Energy Corporation",
  },
  {
    symbol: "SNPS",
    name: "Synopsys, Inc.",
  },
  {
    symbol: "CRWD",
    name: "CrowdStrike Holdings, Inc.",
  },
  {
    symbol: "MAR",
    name: "Marriott International, Inc.",
  },
  {
    symbol: "MRVL",
    name: "Marvell Technology, Inc.",
  },
  {
    symbol: "ORLY",
    name: "O'Reilly Automotive, Inc.",
  },
  {
    symbol: "CDNS",
    name: "Cadence Design Systems, Inc.",
  },
  {
    symbol: "CSX",
    name: "CSX Corporation",
  },
  {
    symbol: "DASH",
    name: "DoorDash, Inc.",
  },
  {
    symbol: "WDAY",
    name: "Workday, Inc.",
  },
  {
    symbol: "FTNT",
    name: "Fortinet, Inc.",
  },
  {
    symbol: "ADSK",
    name: "Autodesk, Inc.",
  },
  {
    symbol: "NXPI",
    name: "NXP Semiconductors N.V.",
  },
  {
    symbol: "TTD",
    name: "The Trade Desk, Inc.",
  },
  {
    symbol: "ROP",
    name: "Roper Technologies, Inc.",
  },
  {
    symbol: "JD",
    name: "JD.com, Inc.",
  },
  {
    symbol: "PCAR",
    name: "PACCAR Inc",
  },
  {
    symbol: "FANG",
    name: "Diamondback Energy, Inc.",
  },
  {
    symbol: "APP",
    name: "AppLovin Corporation",
  },
  {
    symbol: "AEP",
    name: "American Electric Power Company, Inc.",
  },
  {
    symbol: "MNST",
    name: "Monster Beverage Corporation",
  },
  {
    symbol: "COIN",
    name: "Coinbase Global, Inc.",
  },
  {
    symbol: "PAYX",
    name: "Paychex, Inc.",
  },
  {
    symbol: "NTES",
    name: "NetEase, Inc.",
  },
  {
    symbol: "CPRT",
    name: "Copart, Inc.",
  },
  {
    symbol: "TEAM",
    name: "Atlassian Corporation",
  },
  {
    symbol: "ROST",
    name: "Ross Stores, Inc.",
  },
  {
    symbol: "MSTR",
    name: "MicroStrategy Incorporated",
  },
  {
    symbol: "CHTR",
    name: "Charter Communications, Inc.",
  },
  {
    symbol: "KDP",
    name: "Keurig Dr Pepper Inc.",
  },
  {
    symbol: "MPWR",
    name: "Monolithic Power Systems, Inc.",
  },
  {
    symbol: "NDAQ",
    name: "Nasdaq, Inc.",
  },
  {
    symbol: "FAST",
    name: "Fastenal Company",
  },
  {
    symbol: "KHC",
    name: "The Kraft Heinz Company",
  },
  {
    symbol: "DDOG",
    name: "Datadog, Inc.",
  },
  {
    symbol: "ODFL",
    name: "Old Dominion Freight Line, Inc.",
  },
  {
    symbol: "EXC",
    name: "Exelon Corporation",
  },
  {
    symbol: "MCHP",
    name: "Microchip Technology Incorporated",
  },
  {
    symbol: "GEHC",
    name: "GE HealthCare Technologies Inc.",
  },
  {
    symbol: "TCOM",
    name: "Trip.com Group Limited",
  },
  {
    symbol: "ACGL",
    name: "Arch Capital Group Ltd.",
  },
  {
    symbol: "EA",
    name: "Electronic Arts Inc.",
  },
  {
    symbol: "VRSK",
    name: "Verisk Analytics, Inc.",
  },
  {
    symbol: "ALNY",
    name: "Alnylam Pharmaceuticals, Inc.",
  },
  {
    symbol: "IDXX",
    name: "IDEXX Laboratories, Inc.",
  },
  {
    symbol: "CTSH",
    name: "Cognizant Technology Solutions Corporation",
  },
  {
    symbol: "LULU",
    name: "Lululemon Athletica Inc.",
  },
  {
    symbol: "BKR",
    name: "Baker Hughes Company",
  },
  {
    symbol: "XEL",
    name: "Xcel Energy Inc.",
  },
  {
    symbol: "CCEP",
    name: "Coca-Cola Europacific Partners PLC",
  },
  {
    symbol: "AXON",
    name: "Axon Enterprise, Inc.",
  },
  {
    symbol: "ARGX",
    name: "argenx SE",
  },
  {
    symbol: "BIDU",
    name: "Baidu, Inc.",
  },
  {
    symbol: "EBAY",
    name: "eBay Inc.",
  },
  {
    symbol: "CSGP",
    name: "CoStar Group, Inc.",
  },
  {
    symbol: "ON",
    name: "ON Semiconductor Corporation",
  },
  {
    symbol: "DXCM",
    name: "DexCom, Inc.",
  },
  {
    symbol: "FER",
    name: "Ferrovial SE",
  },
  {
    symbol: "FCNCO",
    name: "First Citizens BancShares, Inc.",
  },
  {
    symbol: "FITB",
    name: "Fifth Third Bancorp",
  },
  {
    symbol: "TSCO",
    name: "Tractor Supply Company",
  },
  {
    symbol: "WTW",
    name: "Willis Towers Watson Public Limited Company",
  },
  {
    symbol: "CDW",
    name: "CDW Corporation",
  },
  {
    symbol: "TW",
    name: "Tradeweb Markets Inc.",
  },
  {
    symbol: "TTWO",
    name: "Take-Two Interactive Software, Inc.",
  },
  {
    symbol: "ERIC",
    name: "Telefonaktiebolaget LM Ericsson (publ)",
  },
  {
    symbol: "ANSS",
    name: "ANSYS, Inc.",
  },
  {
    symbol: "ZS",
    name: "Zscaler, Inc.",
  },
  {
    symbol: "LI",
    name: "Li Auto Inc.",
  },
  {
    symbol: "FCNCA",
    name: "First Citizens BancShares, Inc.",
  },
  {
    symbol: "SMCI",
    name: "Super Micro Computer, Inc.",
  },
  {
    symbol: "BIIB",
    name: "Biogen Inc.",
  },
  {
    symbol: "BNTX",
    name: "BioNTech SE",
  },
  {
    symbol: "SBAC",
    name: "SBA Communications Corporation",
  },
  {
    symbol: "VOD",
    name: "Vodafone Group Public Limited Company",
  },
  {
    symbol: "TROW",
    name: "T. Rowe Price Group, Inc.",
  },
  {
    symbol: "NTAP",
    name: "NetApp, Inc.",
  },
  {
    symbol: "UAL",
    name: "United Airlines Holdings, Inc.",
  },
  {
    symbol: "HOOD",
    name: "Robinhood Markets, Inc.",
  },
  {
    symbol: "ERIE",
    name: "Erie Indemnity Company",
  },
  {
    symbol: "WDC",
    name: "Western Digital Corporation",
  },
  {
    symbol: "BGNE",
    name: "BeiGene, Ltd.",
  },
  {
    symbol: "HBAN",
    name: "Huntington Bancshares Incorporated",
  },
  {
    symbol: "CHKP",
    name: "Check Point Software Technologies Ltd.",
  },
  {
    symbol: "ILMN",
    name: "Illumina, Inc.",
  },
  {
    symbol: "ZM",
    name: "Zoom Video Communications, Inc.",
  },
  {
    symbol: "PTC",
    name: "PTC Inc.",
  },
  {
    symbol: "STX",
    name: "Seagate Technology Holdings plc",
  },
  {
    symbol: "CINF",
    name: "Cincinnati Financial Corporation",
  },
  {
    symbol: "GFS",
    name: "GlobalFoundries Inc.",
  },
  {
    symbol: "COO",
    name: "The Cooper Companies, Inc.",
  },
  {
    symbol: "RYAAY",
    name: "Ryanair Holdings plc",
  },
  {
    symbol: "FSLR",
    name: "First Solar, Inc.",
  },
  {
    symbol: "KSPI",
    name: "Joint Stock Company Kaspi.kz",
  },
  {
    symbol: "EXPE",
    name: "Expedia Group, Inc.",
  },
  {
    symbol: "PFG",
    name: "Principal Financial Group, Inc.",
  },
  {
    symbol: "NTRS",
    name: "Northern Trust Corporation",
  },
  {
    symbol: "MRNA",
    name: "Moderna, Inc.",
  },
  {
    symbol: "STLD",
    name: "Steel Dynamics, Inc.",
  },
  {
    symbol: "LPLA",
    name: "LPL Financial Holdings Inc.",
  },
  {
    symbol: "MDB",
    name: "MongoDB, Inc.",
  },
  {
    symbol: "FOXA",
    name: "Fox Corporation",
  },
  {
    symbol: "HOLX",
    name: "Hologic, Inc.",
  },
  {
    symbol: "FWONK",
    name: "Formula One Group",
  },
  {
    symbol: "ZBRA",
    name: "Zebra Technologies Corporation",
  },
  {
    symbol: "FWONA",
    name: "Formula One Group",
  },
  {
    symbol: "SSNC",
    name: "SS&C Technologies Holdings, Inc.",
  },
  {
    symbol: "WBD",
    name: "Warner Bros. Discovery, Inc.",
  },
  {
    symbol: "FOX",
    name: "Fox Corporation",
  },
  {
    symbol: "ICLR",
    name: "ICON Public Limited Company",
  },
  {
    symbol: "VRSN",
    name: "VeriSign, Inc.",
  },
  {
    symbol: "TER",
    name: "Teradyne, Inc.",
  },
  {
    symbol: "CG",
    name: "The Carlyle Group Inc.",
  },
  {
    symbol: "DKNG",
    name: "DraftKings Inc.",
  },
  {
    symbol: "JBHT",
    name: "J.B. Hunt Transport Services, Inc.",
  },
  {
    symbol: "LINE",
    name: "Lineage, Inc.",
  },
  {
    symbol: "ULTA",
    name: "Ulta Beauty, Inc.",
  },
  {
    symbol: "MANH",
    name: "Manhattan Associates, Inc.",
  },
  {
    symbol: "PODD",
    name: "Insulet Corporation",
  },
  {
    symbol: "GEN",
    name: "Gen Digital Inc.",
  },
  {
    symbol: "NTNX",
    name: "Nutanix, Inc.",
  },
  {
    symbol: "WMG",
    name: "Warner Music Group Corp.",
  },
  {
    symbol: "GRAB",
    name: "Grab Holdings Limited",
  },
  {
    symbol: "ALGN",
    name: "Align Technology, Inc.",
  },
  {
    symbol: "IBKR",
    name: "Interactive Brokers Group, Inc.",
  },
  {
    symbol: "LNT",
    name: "Alliant Energy Corporation",
  },
  {
    symbol: "ENTG",
    name: "Entegris, Inc.",
  },
  {
    symbol: "UTHR",
    name: "United Therapeutics Corporation",
  },
  {
    symbol: "AKAM",
    name: "Akamai Technologies, Inc.",
  },
  {
    symbol: "BSY",
    name: "Bentley Systems, Incorporated",
  },
  {
    symbol: "SWKS",
    name: "Skyworks Solutions, Inc.",
  },
  {
    symbol: "NWS",
    name: "News Corporation",
  },
  {
    symbol: "AZPN",
    name: "Aspen Technology, Inc.",
  },
  {
    symbol: "MNDY",
    name: "monday.com Ltd.",
  },
  {
    symbol: "TRMB",
    name: "Trimble Inc.",
  },
  {
    symbol: "NWSA",
    name: "News Corporation",
  },
  {
    symbol: "NTRA",
    name: "Natera, Inc.",
  },
  {
    symbol: "FTAI",
    name: "FTAI Aviation Ltd.",
  },
  {
    symbol: "GMAB",
    name: "Genmab A/S",
  },
  {
    symbol: "SMMT",
    name: "Summit Therapeutics Inc.",
  },
  {
    symbol: "POOL",
    name: "Pool Corporation",
  },
  {
    symbol: "DLTR",
    name: "Dollar Tree, Inc.",
  },
  {
    symbol: "CASY",
    name: "Casey's General Stores, Inc.",
  },
  {
    symbol: "DOCU",
    name: "DocuSign, Inc.",
  },
  {
    symbol: "NDSN",
    name: "Nordson Corporation",
  },
  {
    symbol: "MORN",
    name: "Morningstar, Inc.",
  },
  {
    symbol: "EVRG",
    name: "Evergy, Inc.",
  },
  {
    symbol: "CPB",
    name: "Campbell Soup Company",
  },
  {
    symbol: "GLPI",
    name: "Gaming and Leisure Properties, Inc.",
  },
  {
    symbol: "PCVX",
    name: "Vaxcyte, Inc.",
  },
  {
    symbol: "FLEX",
    name: "Flex Ltd.",
  },
  {
    symbol: "LAMR",
    name: "Lamar Advertising Company",
  },
  {
    symbol: "VTRS",
    name: "Viatris Inc.",
  },
  {
    symbol: "Z",
    name: "Zillow Group, Inc.",
  },
  {
    symbol: "ARCC",
    name: "Ares Capital Corporation",
  },
  {
    symbol: "EWBC",
    name: "East West Bancorp, Inc.",
  },
  {
    symbol: "JKHY",
    name: "Jack Henry & Associates, Inc.",
  },
  {
    symbol: "BMRN",
    name: "BioMarin Pharmaceutical Inc.",
  },
  {
    symbol: "ZG",
    name: "Zillow Group, Inc.",
  },
  {
    symbol: "AFRM",
    name: "Affirm Holdings, Inc.",
  },
  {
    symbol: "REG",
    name: "Regency Centers Corporation",
  },
  {
    symbol: "EXAS",
    name: "Exact Sciences Corporation",
  },
  {
    symbol: "TTEK",
    name: "Tetra Tech, Inc.",
  },
  {
    symbol: "CYBR",
    name: "CyberArk Software Ltd.",
  },
  {
    symbol: "SRPT",
    name: "Sarepta Therapeutics, Inc.",
  },
  {
    symbol: "INCY",
    name: "Incyte Corporation",
  },
  {
    symbol: "CHRW",
    name: "C.H. Robinson Worldwide, Inc.",
  },
  {
    symbol: "FFIV",
    name: "F5, Inc.",
  },
  {
    symbol: "HST",
    name: "Host Hotels & Resorts, Inc.",
  },
  {
    symbol: "INSM",
    name: "Insmed Incorporated",
  },
  {
    symbol: "OKTA",
    name: "Okta, Inc.",
  },
  {
    symbol: "DUOL",
    name: "Duolingo, Inc.",
  },
  {
    symbol: "RPRX",
    name: "Royalty Pharma plc",
  },
  {
    symbol: "FUTU",
    name: "Futu Holdings Limited",
  },
  {
    symbol: "LOGI",
    name: "Logitech International S.A.",
  },
  {
    symbol: "TXRH",
    name: "Texas Roadhouse, Inc.",
  },
  {
    symbol: "PAA",
    name: "Plains All American Pipeline, L.P.",
  },
  {
    symbol: "HTHT",
    name: "H World Group Limited",
  },
  {
    symbol: "SFM",
    name: "Sprouts Farmers Market, Inc.",
  },
  {
    symbol: "NBIX",
    name: "Neurocrine Biosciences, Inc.",
  },
  {
    symbol: "SOFI",
    name: "SoFi Technologies, Inc.",
  },
  {
    symbol: "LBRDK",
    name: "Liberty Broadband Corporation",
  },
  {
    symbol: "LBRDA",
    name: "Liberty Broadband Corporation",
  },
  {
    symbol: "MMYT",
    name: "MakeMyTrip Limited",
  },
  {
    symbol: "CART",
    name: "Maplebear Inc.",
  },
  {
    symbol: "NICE",
    name: "NICE Ltd.",
  },
  {
    symbol: "EXE",
    name: "Expand Energy Corporation",
  },
  {
    symbol: "AUR",
    name: "Aurora Innovation, Inc.",
  },
  {
    symbol: "COKE",
    name: "Coca-Cola Consolidated, Inc.",
  },
  {
    symbol: "PPC",
    name: "Pilgrim's Pride Corporation",
  },
  {
    symbol: "ALAB",
    name: "Astera Labs, Inc.",
  },
  {
    symbol: "SAIA",
    name: "Saia, Inc.",
  },
  {
    symbol: "LECO",
    name: "Lincoln Electric Holdings, Inc.",
  },
  {
    symbol: "MKTX",
    name: "MarketAxess Holdings Inc.",
  },
  {
    symbol: "ENPH",
    name: "Enphase Energy, Inc.",
  },
  {
    symbol: "TECH",
    name: "Bio-Techne Corporation",
  },
  {
    symbol: "WYNN",
    name: "Wynn Resorts, Limited",
  },
  {
    symbol: "ROKU",
    name: "Roku, Inc.",
  },
  {
    symbol: "WING",
    name: "Wingstop Inc.",
  },
  {
    symbol: "RIVN",
    name: "Rivian Automotive, Inc.",
  },
  {
    symbol: "CHDN",
    name: "Churchill Downs Incorporated",
  },
  {
    symbol: "DOX",
    name: "Amdocs Limited",
  },
  {
    symbol: "MEDP",
    name: "Medpace Holdings, Inc.",
  },
  {
    symbol: "MBLY",
    name: "Mobileye Global Inc.",
  },
  {
    symbol: "RGLD",
    name: "Royal Gold, Inc.",
  },
  {
    symbol: "LKQ",
    name: "LKQ Corporation",
  },
  {
    symbol: "VFS",
    name: "VinFast Auto Ltd.",
  },
  {
    symbol: "SEIC",
    name: "SEI Investments Company",
  },
  {
    symbol: "MTCH",
    name: "Match Group, Inc.",
  },
  {
    symbol: "PCTY",
    name: "Paylocity Holding Corporation",
  },
  {
    symbol: "WWD",
    name: "Woodward, Inc.",
  },
  {
    symbol: "OLED",
    name: "Universal Display Corporation",
  },
  {
    symbol: "XP",
    name: "XP Inc.",
  },
  {
    symbol: "ESLT",
    name: "Elbit Systems Ltd.",
  },
  {
    symbol: "CZR",
    name: "Caesars Entertainment, Inc.",
  },
  {
    symbol: "QRVO",
    name: "Qorvo, Inc.",
  },
  {
    symbol: "HAS",
    name: "Hasbro, Inc.",
  },
  {
    symbol: "APA",
    name: "APA Corporation",
  },
  {
    symbol: "WIX",
    name: "Wix.com Ltd.",
  },
  {
    symbol: "TLN",
    name: "Talen Energy Corporation",
  },
  {
    symbol: "FYBR",
    name: "Frontier Communications Parent, Inc.",
  },
  {
    symbol: "SIRI",
    name: "Sirius XM Holdings Inc.",
  },
  {
    symbol: "HSIC",
    name: "Henry Schein, Inc.",
  },
  {
    symbol: "DSGX",
    name: "The Descartes Systems Group Inc.",
  },
  {
    symbol: "GTLB",
    name: "GitLab Inc.",
  },
  {
    symbol: "ALTR",
    name: "Altair Engineering Inc.",
  },
  {
    symbol: "BRKR",
    name: "Bruker Corporation",
  },
  {
    symbol: "GGAL",
    name: "Grupo Financiero Galicia S.A.",
  },
  {
    symbol: "OTEX",
    name: "Open Text Corporation",
  },
  {
    symbol: "ROIV",
    name: "Roivant Sciences Ltd.",
  },
  {
    symbol: "AAON",
    name: "AAON, Inc.",
  },
  {
    symbol: "MTSI",
    name: "MACOM Technology Solutions Holdings, Inc.",
  },
  {
    symbol: "ENSG",
    name: "The Ensign Group, Inc.",
  },
  {
    symbol: "AAL",
    name: "American Airlines Group Inc.",
  },
  {
    symbol: "DBX",
    name: "Dropbox, Inc.",
  },
  {
    symbol: "AGNC",
    name: "AGNC Investment Corp.",
  },
  {
    symbol: "FSV",
    name: "FirstService Corporation",
  },
  {
    symbol: "BILI",
    name: "Bilibili Inc.",
  },
  {
    symbol: "LNW",
    name: "Light & Wonder, Inc.",
  },
  {
    symbol: "VKTX",
    name: "Viking Therapeutics, Inc.",
  },
  {
    symbol: "LEGN",
    name: "Legend Biotech Corporation",
  },
  {
    symbol: "WBA",
    name: "Walgreens Boots Alliance, Inc.",
  },
  {
    symbol: "EXEL",
    name: "Exelixis, Inc.",
  },
  {
    symbol: "ITCI",
    name: "Intra-Cellular Therapies, Inc.",
  },
  {
    symbol: "UFPI",
    name: "UFP Industries, Inc.",
  },
  {
    symbol: "CHRD",
    name: "Chord Energy Corporation",
  },
  {
    symbol: "CBSH",
    name: "Commerce Bancshares, Inc.",
  },
  {
    symbol: "RVMD",
    name: "Revolution Medicines, Inc.",
  },
  {
    symbol: "PNFP",
    name: "Pinnacle Financial Partners, Inc.",
  },
  {
    symbol: "ASND",
    name: "Ascendis Pharma A/S",
  },
  {
    symbol: "CROX",
    name: "Crocs, Inc.",
  },
  {
    symbol: "ZION",
    name: "Zions Bancorporation, National Association",
  },
  {
    symbol: "LBTYK",
    name: "Liberty Global Ltd.",
  },
  {
    symbol: "LBTYB",
    name: "Liberty Global Ltd.",
  },
  {
    symbol: "HQY",
    name: "HealthEquity, Inc.",
  },
  {
    symbol: "LNTH",
    name: "Lantheus Holdings, Inc.",
  },
  {
    symbol: "WTFC",
    name: "Wintrust Financial Corporation",
  },
  {
    symbol: "RGEN",
    name: "Repligen Corporation",
  },
  {
    symbol: "LBTYA",
    name: "Liberty Global Ltd.",
  },
  {
    symbol: "MASI",
    name: "Masimo Corporation",
  },
  {
    symbol: "DRS",
    name: "Leonardo DRS, Inc.",
  },
  {
    symbol: "CIGI",
    name: "Colliers International Group Inc.",
  },
  {
    symbol: "HLNE",
    name: "Hamilton Lane Incorporated",
  },
  {
    symbol: "MIDD",
    name: "The Middleby Corporation",
  },
  {
    symbol: "LSCC",
    name: "Lattice Semiconductor Corporation",
  },
  {
    symbol: "CELH",
    name: "Celsius Holdings, Inc.",
  },
  {
    symbol: "PARAA",
    name: "Paramount Global",
  },
  {
    symbol: "IEP",
    name: "Icahn Enterprises L.P.",
  },
  {
    symbol: "AMKR",
    name: "Amkor Technology, Inc.",
  },
  {
    symbol: "SPSC",
    name: "SPS Commerce, Inc.",
  },
  {
    symbol: "MRNO",
    name: "Murano Global Investments Plc",
  },
  {
    symbol: "SAIC",
    name: "Science Applications International Corporation",
  },
  {
    symbol: "TEM",
    name: "Tempus AI, Inc",
  },
  {
    symbol: "TPG",
    name: "TPG Inc.",
  },
  {
    symbol: "WSC",
    name: "WillScot Holdings Corporation",
  },
  {
    symbol: "CFLT",
    name: "Confluent, Inc.",
  },
  {
    symbol: "APPF",
    name: "AppFolio, Inc.",
  },
  {
    symbol: "CCCS",
    name: "CCC Intelligent Solutions Holdings Inc.",
  },
  {
    symbol: "BOKF",
    name: "BOK Financial Corporation",
  },
  {
    symbol: "PARA",
    name: "Paramount Global",
  },
  {
    symbol: "NSIT",
    name: "Insight Enterprises, Inc.",
  },
  {
    symbol: "GRFS",
    name: "Grifols, S.A.",
  },
  {
    symbol: "HCP",
    name: "HashiCorp, Inc.",
  },
  {
    symbol: "PEGA",
    name: "Pegasystems Inc.",
  },
  {
    symbol: "GNTX",
    name: "Gentex Corporation",
  },
  {
    symbol: "DJT",
    name: "Trump Media & Technology Group Corp.",
  },
  {
    symbol: "SATS",
    name: "EchoStar Corporation",
  },
  {
    symbol: "MKSI",
    name: "MKS Instruments, Inc.",
  },
  {
    symbol: "JAZZ",
    name: "Jazz Pharmaceuticals plc",
  },
  {
    symbol: "CGNX",
    name: "Cognex Corporation",
  },
  {
    symbol: "NUVL",
    name: "Nuvalent, Inc.",
  },
  {
    symbol: "LCID",
    name: "Lucid Group, Inc.",
  },
  {
    symbol: "VERX",
    name: "Vertex, Inc.",
  },
  {
    symbol: "CRDO",
    name: "Credo Technology Group Holding Ltd",
  },
  {
    symbol: "CWST",
    name: "Casella Waste Systems, Inc.",
  },
  {
    symbol: "FRPT",
    name: "Freshpet, Inc.",
  },
  {
    symbol: "CRUS",
    name: "Cirrus Logic, Inc.",
  },
  {
    symbol: "FRHC",
    name: "Freedom Holding Corp.",
  },
  {
    symbol: "GLBE",
    name: "Global-E Online Ltd.",
  },
  {
    symbol: "BPOP",
    name: "Popular, Inc.",
  },
  {
    symbol: "LFUS",
    name: "Littelfuse, Inc.",
  },
  {
    symbol: "REYN",
    name: "Reynolds Consumer Products Inc.",
  },
  {
    symbol: "LSTR",
    name: "Landstar System, Inc.",
  },
  {
    symbol: "VRNS",
    name: "Varonis Systems, Inc.",
  },
  {
    symbol: "MAT",
    name: "Mattel, Inc.",
  },
  {
    symbol: "EXLS",
    name: "ExlService Holdings, Inc.",
  },
  {
    symbol: "BZ",
    name: "Kanzhun Limited",
  },
  {
    symbol: "HALO",
    name: "Halozyme Therapeutics, Inc.",
  },
  {
    symbol: "NOVT",
    name: "Novanta Inc.",
  },
  {
    symbol: "CYTK",
    name: "Cytokinetics, Incorporated",
  },
  {
    symbol: "IONS",
    name: "Ionis Pharmaceuticals, Inc.",
  },
  {
    symbol: "QXO",
    name: "QXO, Inc.",
  },
  {
    symbol: "CSWI",
    name: "CSW Industrials, Inc.",
  },
  {
    symbol: "ONB",
    name: "Old National Bancorp",
  },
  {
    symbol: "AVAV",
    name: "AeroVironment, Inc.",
  },
  {
    symbol: "RCM",
    name: "R1 RCM Inc.",
  },
  {
    symbol: "COLB",
    name: "Columbia Banking System, Inc.",
  },
  {
    symbol: "BECN",
    name: "Beacon Roofing Supply, Inc.",
  },
  {
    symbol: "CVLT",
    name: "Commvault Systems, Inc.",
  },
  {
    symbol: "CACC",
    name: "Credit Acceptance Corporation",
  },
  {
    symbol: "COOP",
    name: "Mr. Cooper Group Inc.",
  },
  {
    symbol: "SIGI",
    name: "Selective Insurance Group, Inc.",
  },
  {
    symbol: "LYFT",
    name: "Lyft, Inc.",
  },
  {
    symbol: "SRCL",
    name: "Stericycle, Inc.",
  },
  {
    symbol: "WFRD",
    name: "Weatherford International plc",
  },
  {
    symbol: "MMSI",
    name: "Merit Medical Systems, Inc.",
  },
  {
    symbol: "ETSY",
    name: "Etsy, Inc.",
  },
  {
    symbol: "OLLI",
    name: "Ollie's Bargain Outlet Holdings, Inc.",
  },
  {
    symbol: "RKLB",
    name: "Rocket Lab USA, Inc.",
  },
  {
    symbol: "CHX",
    name: "ChampionX Corporation",
  },
  {
    symbol: "ACT",
    name: "Enact Holdings, Inc.",
  },
  {
    symbol: "NXST",
    name: "Nexstar Media Group, Inc.",
  },
  {
    symbol: "PI",
    name: "Impinj, Inc.",
  },
  {
    symbol: "VNOM",
    name: "Viper Energy, Inc.",
  },
  {
    symbol: "EXPO",
    name: "Exponent, Inc.",
  },
  {
    symbol: "BCPC",
    name: "Balchem Corporation",
  },
  {
    symbol: "MARA",
    name: "MARA Holdings, Inc.",
  },
  {
    symbol: "NVMI",
    name: "Nova Ltd.",
  },
  {
    symbol: "CRNX",
    name: "Crinetics Pharmaceuticals, Inc.",
  },
  {
    symbol: "RNA",
    name: "Avidity Biosciences, Inc.",
  },
  {
    symbol: "LLYVK",
    name: "Liberty Live Group",
  },
  {
    symbol: "BPMC",
    name: "Blueprint Medicines Corporation",
  },
  {
    symbol: "FFIN",
    name: "First Financial Bankshares, Inc.",
  },
  {
    symbol: "LLYVA",
    name: "Liberty Live Group",
  },
  {
    symbol: "CRVL",
    name: "CorVel Corporation",
  },
  {
    symbol: "QFIN",
    name: "Qifu Technology, Inc.",
  },
  {
    symbol: "UMBF",
    name: "UMB Financial Corporation",
  },
  {
    symbol: "ACIW",
    name: "ACI Worldwide, Inc.",
  },
  {
    symbol: "OPCH",
    name: "Option Care Health, Inc.",
  },
  {
    symbol: "RARE",
    name: "Ultragenyx Pharmaceutical Inc.",
  },
  {
    symbol: "OZK",
    name: "Bank OZK",
  },
  {
    symbol: "KRYS",
    name: "Krystal Biotech, Inc.",
  },
  {
    symbol: "UBSI",
    name: "United Bankshares, Inc.",
  },
  {
    symbol: "ASTS",
    name: "AST SpaceMobile, Inc.",
  },
  {
    symbol: "OS",
    name: "OneStream, Inc.",
  },
  {
    symbol: "XRAY",
    name: "DENTSPLY SIRONA Inc.",
  },
  {
    symbol: "CORT",
    name: "Corcept Therapeutics Incorporated",
  },
  {
    symbol: "TSEM",
    name: "Tower Semiconductor Ltd.",
  },
  {
    symbol: "FIVE",
    name: "Five Below, Inc.",
  },
  {
    symbol: "RDNT",
    name: "RadNet, Inc.",
  },
  {
    symbol: "VLY",
    name: "Valley National Bancorp",
  },
  {
    symbol: "TENB",
    name: "Tenable Holdings, Inc.",
  },
  {
    symbol: "LANC",
    name: "Lancaster Colony Corporation",
  },
  {
    symbol: "TIGO",
    name: "Millicom International Cellular S.A.",
  },
  {
    symbol: "AVT",
    name: "Avnet, Inc.",
  },
  {
    symbol: "NVEI",
    name: "Nuvei Corporation",
  },
  {
    symbol: "ACHC",
    name: "Acadia Healthcare Company, Inc.",
  },
  {
    symbol: "ESGR",
    name: "Enstar Group Limited",
  },
  {
    symbol: "ALGM",
    name: "Allegro MicroSystems, Inc.",
  },
  {
    symbol: "SLM",
    name: "SLM Corporation",
  },
  {
    symbol: "STRL",
    name: "Sterling Infrastructure, Inc.",
  },
  {
    symbol: "FELE",
    name: "Franklin Electric Co., Inc.",
  },
  {
    symbol: "ACLX",
    name: "Arcellx, Inc.",
  },
  {
    symbol: "EEFT",
    name: "Euronet Worldwide, Inc.",
  },
  {
    symbol: "FCFS",
    name: "FirstCash Holdings, Inc.",
  },
  {
    symbol: "ITRI",
    name: "Itron, Inc.",
  },
  {
    symbol: "UPST",
    name: "Upstart Holdings, Inc.",
  },
  {
    symbol: "BBIO",
    name: "BridgeBio Pharma, Inc.",
  },
  {
    symbol: "PECO",
    name: "Phillips Edison & Company, Inc.",
  },
  {
    symbol: "RMBS",
    name: "Rambus Inc.",
  },
  {
    symbol: "WAY",
    name: "Waystar Holding Corp.",
  },
  {
    symbol: "BGC",
    name: "BGC Group, Inc.",
  },
  {
    symbol: "COLM",
    name: "Columbia Sportswear Company",
  },
  {
    symbol: "NXT",
    name: "Nextracker Inc.",
  },
  {
    symbol: "IMVT",
    name: "Immunovant, Inc.",
  },
  {
    symbol: "HWC",
    name: "Hancock Whitney Corporation",
  },
  {
    symbol: "IAC",
    name: "IAC Inc.",
  },
  {
    symbol: "SBRA",
    name: "Sabra Health Care REIT, Inc.",
  },
  {
    symbol: "STEP",
    name: "StepStone Group Inc.",
  },
  {
    symbol: "LITE",
    name: "Lumentum Holdings Inc.",
  },
  {
    symbol: "CALM",
    name: "Cal-Maine Foods, Inc.",
  },
  {
    symbol: "ALKS",
    name: "Alkermes plc",
  },
  {
    symbol: "NCNO",
    name: "nCino, Inc.",
  },
  {
    symbol: "QLYS",
    name: "Qualys, Inc.",
  },
  {
    symbol: "MDGL",
    name: "Madrigal Pharmaceuticals, Inc.",
  },
  {
    symbol: "SHC",
    name: "Sotera Health Company",
  },
  {
    symbol: "VRRM",
    name: "Verra Mobility Corporation",
  },
  {
    symbol: "BLKB",
    name: "Blackbaud, Inc.",
  },
  {
    symbol: "ICUI",
    name: "ICU Medical, Inc.",
  },
  {
    symbol: "FIZZ",
    name: "National Beverage Corp.",
  },
  {
    symbol: "AXSM",
    name: "Axsome Therapeutics, Inc.",
  },
  {
    symbol: "CRSP",
    name: "CRISPR Therapeutics AG",
  },
  {
    symbol: "IESC",
    name: "IES Holdings, Inc.",
  },
  {
    symbol: "SITM",
    name: "SiTime Corporation",
  },
  {
    symbol: "RUSHA",
    name: "Rush Enterprises, Inc.",
  },
  {
    symbol: "ROAD",
    name: "Construction Partners, Inc.",
  },
  {
    symbol: "GBDC",
    name: "Golub Capital BDC, Inc.",
  },
  {
    symbol: "TMDX",
    name: "TransMedics Group, Inc.",
  },
  {
    symbol: "RUSHB",
    name: "Rush Enterprises, Inc.",
  },
  {
    symbol: "AEIS",
    name: "Advanced Energy Industries, Inc.",
  },
  {
    symbol: "GDS",
    name: "GDS Holdings Limited",
  },
  {
    symbol: "WEN",
    name: "The Wendy's Company",
  },
  {
    symbol: "PLXS",
    name: "Plexus Corp.",
  },
  {
    symbol: "ALVO",
    name: "Alvotech",
  },
  {
    symbol: "CLBT",
    name: "Cellebrite DI Ltd.",
  },
  {
    symbol: "SGRY",
    name: "Surgery Partners, Inc.",
  },
  {
    symbol: "GLNG",
    name: "Golar LNG Limited",
  },
  {
    symbol: "CCOI",
    name: "Cogent Communications Holdings, Inc.",
  },
  {
    symbol: "IPAR",
    name: "Interparfums, Inc.",
  },
  {
    symbol: "LOPE",
    name: "Grand Canyon Education, Inc.",
  },
  {
    symbol: "INTA",
    name: "Intapp, Inc.",
  },
  {
    symbol: "VCTR",
    name: "Victory Capital Holdings, Inc.",
  },
  {
    symbol: "FTDR",
    name: "Frontdoor, Inc.",
  },
  {
    symbol: "IBOC",
    name: "International Bancshares Corporation",
  },
  {
    symbol: "ZI",
    name: "ZoomInfo Technologies Inc.",
  },
  {
    symbol: "DNLI",
    name: "Denali Therapeutics Inc.",
  },
  {
    symbol: "ALKT",
    name: "Alkami Technology, Inc.",
  },
  {
    symbol: "ASO",
    name: "Academy Sports and Outdoors, Inc.",
  },
  {
    symbol: "DOOO",
    name: "BRP Inc.",
  },
  {
    symbol: "SKYW",
    name: "SkyWest, Inc.",
  },
  {
    symbol: "ADMA",
    name: "ADMA Biologics, Inc.",
  },
  {
    symbol: "IDCC",
    name: "InterDigital, Inc.",
  },
  {
    symbol: "SRAD",
    name: "Sportradar Group AG",
  },
  {
    symbol: "SLAB",
    name: "Silicon Laboratories Inc.",
  },
  {
    symbol: "SANM",
    name: "Sanmina Corporation",
  },
  {
    symbol: "WDFC",
    name: "WD-40 Company",
  },
  {
    symbol: "BANF",
    name: "BancFirst Corporation",
  },
  {
    symbol: "KTOS",
    name: "Kratos Defense & Security Solutions, Inc.",
  },
  {
    symbol: "TCBI",
    name: "Texas Capital Bancshares, Inc.",
  },
  {
    symbol: "ATAT",
    name: "Atour Lifestyle Holdings Limited",
  },
  {
    symbol: "AXNX",
    name: "Axonics, Inc.",
  },
  {
    symbol: "PAGP",
    name: "Plains GP Holdings, L.P.",
  },
  {
    symbol: "TFSL",
    name: "TFS Financial Corporation",
  },
  {
    symbol: "MRUS",
    name: "Merus N.V.",
  },
  {
    symbol: "BL",
    name: "BlackLine, Inc.",
  },
  {
    symbol: "POWI",
    name: "Power Integrations, Inc.",
  },
  {
    symbol: "CORZ",
    name: "Core Scientific, Inc.",
  },
  {
    symbol: "CAMT",
    name: "Camtek Ltd.",
  },
  {
    symbol: "DORM",
    name: "Dorman Products, Inc.",
  },
  {
    symbol: "FRSH",
    name: "Freshworks Inc.",
  },
  {
    symbol: "HCM",
    name: "HUTCHMED (China) Limited",
  },
  {
    symbol: "FOLD",
    name: "Amicus Therapeutics, Inc.",
  },
  {
    symbol: "PRCT",
    name: "PROCEPT BioRobotics Corporation",
  },
  {
    symbol: "STNE",
    name: "StoneCo Ltd.",
  },
  {
    symbol: "BWIN",
    name: "The Baldwin Insurance Group, Inc.",
  },
  {
    symbol: "CVCO",
    name: "Cavco Industries, Inc.",
  },
  {
    symbol: "EBC",
    name: "Eastern Bankshares, Inc.",
  },
  {
    symbol: "FORM",
    name: "FormFactor, Inc.",
  },
  {
    symbol: "NWE",
    name: "NorthWestern Energy Group, Inc.",
  },
  {
    symbol: "APLS",
    name: "Apellis Pharmaceuticals, Inc.",
  },
  {
    symbol: "IPGP",
    name: "IPG Photonics Corporation",
  },
  {
    symbol: "PCH",
    name: "PotlatchDeltic Corporation",
  },
  {
    symbol: "FIBK",
    name: "First Interstate BancSystem, Inc.",
  },
  {
    symbol: "SMPL",
    name: "The Simply Good Foods Company",
  },
  {
    symbol: "TGTX",
    name: "TG Therapeutics, Inc.",
  },
  {
    symbol: "CARG",
    name: "CarGurus, Inc.",
  },
  {
    symbol: "MGEE",
    name: "MGE Energy, Inc.",
  },
  {
    symbol: "SMTC",
    name: "Semtech Corporation",
  },
  {
    symbol: "SHOO",
    name: "Steven Madden, Ltd.",
  },
  {
    symbol: "IRDM",
    name: "Iridium Communications Inc.",
  },
  {
    symbol: "OTTR",
    name: "Otter Tail Corporation",
  },
  {
    symbol: "ARLP",
    name: "Alliance Resource Partners, L.P.",
  },
  {
    symbol: "ZLAB",
    name: "Zai Lab Limited",
  },
  {
    symbol: "CATY",
    name: "Cathay General Bancorp",
  },
  {
    symbol: "EWTX",
    name: "Edgewise Therapeutics, Inc.",
  },
  {
    symbol: "FULT",
    name: "Fulton Financial Corporation",
  },
  {
    symbol: "FROG",
    name: "JFrog Ltd.",
  },
  {
    symbol: "URBN",
    name: "Urban Outfitters, Inc.",
  },
  {
    symbol: "JJSF",
    name: "J&J Snack Foods Corp.",
  },
  {
    symbol: "LIF",
    name: "Life360, Inc.",
  },
  {
    symbol: "PAYO",
    name: "Payoneer Global Inc.",
  },
  {
    symbol: "IOVA",
    name: "Iovance Biotherapeutics, Inc.",
  },
  {
    symbol: "AMED",
    name: "Amedisys, Inc.",
  },
  {
    symbol: "PTCT",
    name: "PTC Therapeutics, Inc.",
  },
  {
    symbol: "XENE",
    name: "Xenon Pharmaceuticals Inc.",
  },
  {
    symbol: "BRZE",
    name: "Braze, Inc.",
  },
  {
    symbol: "NMIH",
    name: "NMI Holdings, Inc.",
  },
  {
    symbol: "ICFI",
    name: "ICF International, Inc.",
  },
  {
    symbol: "PTEN",
    name: "Patterson-UTI Energy, Inc.",
  },
  {
    symbol: "RUN",
    name: "Sunrun Inc.",
  },
  {
    symbol: "DYN",
    name: "Dyne Therapeutics, Inc.",
  },
  {
    symbol: "OMAB",
    name: "Grupo Aeroportuario del Centro Norte, S.A.B. de C.V.",
  },
  {
    symbol: "KYMR",
    name: "Kymera Therapeutics, Inc.",
  },
  {
    symbol: "RIOT",
    name: "Riot Platforms, Inc.",
  },
  {
    symbol: "FHB",
    name: "First Hawaiian, Inc.",
  },
  {
    symbol: "AGYS",
    name: "Agilysys, Inc.",
  },
  {
    symbol: "RYTM",
    name: "Rhythm Pharmaceuticals, Inc.",
  },
  {
    symbol: "APGE",
    name: "Apogee Therapeutics, Inc.",
  },
  {
    symbol: "PATK",
    name: "Patrick Industries, Inc.",
  },
  {
    symbol: "CLSK",
    name: "CleanSpark, Inc.",
  },
  {
    symbol: "RRR",
    name: "Red Rock Resorts, Inc.",
  },
  {
    symbol: "LOT",
    name: "Lotus Technology Inc.",
  },
  {
    symbol: "WSFS",
    name: "WSFS Financial Corporation",
  },
  {
    symbol: "POWL",
    name: "Powell Industries, Inc.",
  },
  {
    symbol: "DIOD",
    name: "Diodes Incorporated",
  },
  {
    symbol: "NWL",
    name: "Newell Brands Inc.",
  },
  {
    symbol: "CAR",
    name: "Avis Budget Group, Inc.",
  },
  {
    symbol: "BHF",
    name: "Brighthouse Financial, Inc.",
  },
  {
    symbol: "CNXC",
    name: "Concentrix Corporation",
  },
  {
    symbol: "SYM",
    name: "Symbotic Inc.",
  },
  {
    symbol: "ACVA",
    name: "ACV Auctions Inc.",
  },
  {
    symbol: "SFNC",
    name: "Simmons First National Corporation",
  },
  {
    symbol: "NEOG",
    name: "Neogen Corporation",
  },
  {
    symbol: "MLCO",
    name: "Melco Resorts & Entertainment Limited",
  },
  {
    symbol: "ACLS",
    name: "Axcelis Technologies, Inc.",
  },
  {
    symbol: "IBRX",
    name: "ImmunityBio, Inc.",
  },
  {
    symbol: "USLM",
    name: "United States Lime & Minerals, Inc.",
  },
  {
    symbol: "MLTX",
    name: "MoonLake Immunotherapeutics",
  },
  {
    symbol: "LIVN",
    name: "LivaNova PLC",
  },
  {
    symbol: "PENN",
    name: "PENN Entertainment, Inc.",
  },
  {
    symbol: "SYNA",
    name: "Synaptics Incorporated",
  },
  {
    symbol: "INTR",
    name: "Inter & Co, Inc.",
  },
  {
    symbol: "PLTK",
    name: "Playtika Holding Corp.",
  },
  {
    symbol: "RELY",
    name: "Remitly Global, Inc.",
  },
  {
    symbol: "PSMT",
    name: "PriceSmart, Inc.",
  },
  {
    symbol: "VRNA",
    name: "Verona Pharma plc",
  },
  {
    symbol: "PRGS",
    name: "Progress Software Corporation",
  },
  {
    symbol: "JANX",
    name: "Janux Therapeutics, Inc.",
  },
  {
    symbol: "WAFD",
    name: "WaFd, Inc.",
  },
  {
    symbol: "PTGX",
    name: "Protagonist Therapeutics, Inc.",
  },
  {
    symbol: "PSNY",
    name: "Polestar Automotive Holding UK PLC",
  },
  {
    symbol: "CVBF",
    name: "CVB Financial Corp.",
  },
  {
    symbol: "ASTH",
    name: "Astrana Health, Inc.",
  },
  {
    symbol: "IOSP",
    name: "Innospec Inc.",
  },
  {
    symbol: "MEOH",
    name: "Methanex Corporation",
  },
  {
    symbol: "SNEX",
    name: "StoneX Group Inc.",
  },
  {
    symbol: "VIRT",
    name: "Virtu Financial, Inc.",
  },
  {
    symbol: "TBBK",
    name: "The Bancorp, Inc.",
  },
  {
    symbol: "LFST",
    name: "LifeStance Health Group, Inc.",
  },
  {
    symbol: "MQ",
    name: "Marqeta, Inc.",
  },
  {
    symbol: "HUBG",
    name: "Hub Group, Inc.",
  },
  {
    symbol: "FLNC",
    name: "Fluence Energy, Inc.",
  },
  {
    symbol: "INDB",
    name: "Independent Bank Corp.",
  },
  {
    symbol: "BTSG",
    name: "BrightSpring Health Services, Inc.",
  },
  {
    symbol: "SRRK",
    name: "Scholar Rock Holding Corporation",
  },
  {
    symbol: "ALRM",
    name: "Alarm.com Holdings, Inc.",
  },
  {
    symbol: "GSHD",
    name: "Goosehead Insurance, Inc",
  },
  {
    symbol: "FA",
    name: "First Advantage Corporation",
  },
  {
    symbol: "NMRK",
    name: "Newmark Group, Inc.",
  },
  {
    symbol: "QDEL",
    name: "QuidelOrtho Corporation",
  },
  {
    symbol: "PLUS",
    name: "ePlus inc.",
  },
  {
    symbol: "MGRC",
    name: "McGrath RentCorp",
  },
  {
    symbol: "TRMD",
    name: "TORM plc",
  },
  {
    symbol: "AMRX",
    name: "Amneal Pharmaceuticals, Inc.",
  },
  {
    symbol: "AGIO",
    name: "Agios Pharmaceuticals, Inc.",
  },
  {
    symbol: "NARI",
    name: "Inari Medical, Inc.",
  },
  {
    symbol: "PYCR",
    name: "Paycor HCM, Inc.",
  },
  {
    symbol: "VC",
    name: "Visteon Corporation",
  },
  {
    symbol: "AY",
    name: "Atlantica Sustainable Infrastructure plc",
  },
  {
    symbol: "CPRX",
    name: "Catalyst Pharmaceuticals, Inc.",
  },
  {
    symbol: "VCYT",
    name: "Veracyte, Inc.",
  },
  {
    symbol: "BATRK",
    name: "Atlanta Braves Holdings, Inc.",
  },
  {
    symbol: "DLO",
    name: "DLocal Limited",
  },
  {
    symbol: "GH",
    name: "Guardant Health, Inc.",
  },
  {
    symbol: "HWKN",
    name: "Hawkins, Inc.",
  },
  {
    symbol: "PLMR",
    name: "Palomar Holdings, Inc.",
  },
  {
    symbol: "ARWR",
    name: "Arrowhead Pharmaceuticals, Inc.",
  },
  {
    symbol: "IDYA",
    name: "IDEAYA Biosciences, Inc.",
  },
  {
    symbol: "HTLF",
    name: "Heartland Financial USA, Inc.",
  },
  {
    symbol: "LGIH",
    name: "LGI Homes, Inc.",
  },
  {
    symbol: "GT",
    name: "The Goodyear Tire & Rubber Company",
  },
  {
    symbol: "CGON",
    name: "CG Oncology, Inc.",
  },
  {
    symbol: "IBTX",
    name: "Independent Bank Group, Inc.",
  },
  {
    symbol: "IRTC",
    name: "iRhythm Technologies, Inc.",
  },
  {
    symbol: "TOWN",
    name: "TowneBank",
  },
  {
    symbol: "FFBC",
    name: "First Financial Bancorp.",
  },
  {
    symbol: "IQ",
    name: "iQIYI, Inc.",
  },
  {
    symbol: "RPD",
    name: "Rapid7, Inc.",
  },
  {
    symbol: "JBLU",
    name: "JetBlue Airways Corporation",
  },
  {
    symbol: "AMPH",
    name: "Amphastar Pharmaceuticals, Inc.",
  },
  {
    symbol: "PPBI",
    name: "Pacific Premier Bancorp, Inc.",
  },
  {
    symbol: "GERN",
    name: "Geron Corporation",
  },
  {
    symbol: "ARCB",
    name: "ArcBest Corporation",
  },
  {
    symbol: "ACAD",
    name: "ACADIA Pharmaceuticals Inc.",
  },
  {
    symbol: "DRVN",
    name: "Driven Brands Holdings Inc.",
  },
  {
    symbol: "WULF",
    name: "TeraWulf Inc.",
  },
  {
    symbol: "AMBA",
    name: "Ambarella, Inc.",
  },
  {
    symbol: "GDRX",
    name: "GoodRx Holdings, Inc.",
  },
  {
    symbol: "PCT",
    name: "PureCycle Technologies, Inc.",
  },
  {
    symbol: "KLIC",
    name: "Kulicke and Soffa Industries, Inc.",
  },
  {
    symbol: "TWST",
    name: "Twist Bioscience Corporation",
  },
  {
    symbol: "LAUR",
    name: "Laureate Education, Inc.",
  },
  {
    symbol: "PTON",
    name: "Peloton Interactive, Inc.",
  },
  {
    symbol: "LBPH",
    name: "Longboard Pharmaceuticals, Inc.",
  },
  {
    symbol: "APPN",
    name: "Appian Corporation",
  },
  {
    symbol: "PSEC",
    name: "Prospect Capital Corporation",
  },
  {
    symbol: "ADUS",
    name: "Addus HomeCare Corporation",
  },
  {
    symbol: "FIVN",
    name: "Five9, Inc.",
  },
  {
    symbol: "CRTO",
    name: "Criteo S.A.",
  },
  {
    symbol: "SBCF",
    name: "Seacoast Banking Corporation of Florida",
  },
  {
    symbol: "WERN",
    name: "Werner Enterprises, Inc.",
  },
  {
    symbol: "SBLK",
    name: "Star Bulk Carriers Corp.",
  },
  {
    symbol: "OSIS",
    name: "OSI Systems, Inc.",
  },
  {
    symbol: "CENT",
    name: "Central Garden & Pet Company",
  },
  {
    symbol: "AVPT",
    name: "AvePoint, Inc.",
  },
  {
    symbol: "WVE",
    name: "Wave Life Sciences Ltd.",
  },
  {
    symbol: "TRUP",
    name: "Trupanion, Inc.",
  },
  {
    symbol: "KROS",
    name: "Keros Therapeutics, Inc.",
  },
  {
    symbol: "NFE",
    name: "New Fortress Energy Inc.",
  },
  {
    symbol: "BANR",
    name: "Banner Corporation",
  },
  {
    symbol: "VEON",
    name: "VEON Ltd.",
  },
  {
    symbol: "ODD",
    name: "Oddity Tech Ltd.",
  },
  {
    symbol: "OCSL",
    name: "Oaktree Specialty Lending Corporation",
  },
  {
    symbol: "BLBD",
    name: "Blue Bird Corporation",
  },
  {
    symbol: "WINA",
    name: "Winmark Corporation",
  },
  {
    symbol: "ADEA",
    name: "Adeia Inc.",
  },
  {
    symbol: "RBCAA",
    name: "Republic Bancorp, Inc.",
  },
  {
    symbol: "OLPX",
    name: "Olaplex Holdings, Inc.",
  },
  {
    symbol: "DMLP",
    name: "Dorchester Minerals, L.P.",
  },
  {
    symbol: "QCRH",
    name: "QCR Holdings, Inc.",
  },
  {
    symbol: "COGT",
    name: "Cogent Biosciences, Inc.",
  },
  {
    symbol: "SAVA",
    name: "Cassava Sciences, Inc.",
  },
  {
    symbol: "VSAT",
    name: "Viasat, Inc.",
  },
  {
    symbol: "SSRM",
    name: "SSR Mining Inc.",
  },
  {
    symbol: "BELFA",
    name: "Bel Fuse Inc.",
  },
  {
    symbol: "SDGR",
    name: "Schrödinger, Inc.",
  },
  {
    symbol: "CRAI",
    name: "CRA International, Inc.",
  },
  {
    symbol: "MRTN",
    name: "Marten Transport, Ltd.",
  },
  {
    symbol: "MXL",
    name: "MaxLinear, Inc.",
  },
  {
    symbol: "THRM",
    name: "Gentherm Incorporated",
  },
  {
    symbol: "FORTY",
    name: "Formula Systems (1985) Ltd.",
  },
  {
    symbol: "MGPI",
    name: "MGP Ingredients, Inc.",
  },
  {
    symbol: "MFIC",
    name: "MidCap Financial Investment Corporation",
  },
  {
    symbol: "EVO",
    name: "Evotec SE",
  },
  {
    symbol: "CMPO",
    name: "CompoSecure, Inc.",
  },
  {
    symbol: "ESTA",
    name: "Establishment Labs Holdings Inc.",
  },
  {
    symbol: "PRAX",
    name: "Praxis Precision Medicines, Inc.",
  },
  {
    symbol: "AVDL",
    name: "Avadel Pharmaceuticals plc",
  },
  {
    symbol: "NMFC",
    name: "New Mountain Finance Corporation",
  },
  {
    symbol: "XRX",
    name: "Xerox Holdings Corporation",
  },
  {
    symbol: "NN",
    name: "NextNav Inc.",
  },
  {
    symbol: "OPEN",
    name: "Opendoor Technologies Inc.",
  },
  {
    symbol: "INVA",
    name: "Innoviva, Inc.",
  },
  {
    symbol: "UDMY",
    name: "Udemy, Inc.",
  },
  {
    symbol: "BCAX",
    name: "Bicara Therapeutics Inc.",
  },
  {
    symbol: "LZ",
    name: "LegalZoom.com, Inc.",
  },
  {
    symbol: "ARHS",
    name: "Arhaus, Inc.",
  },
  {
    symbol: "RDFN",
    name: "Redfin Corporation",
  },
  {
    symbol: "TBLA",
    name: "Taboola.com Ltd.",
  },
  {
    symbol: "WOOF",
    name: "Petco Health and Wellness Company, Inc.",
  },
  {
    symbol: "ANGI",
    name: "Angi Inc.",
  },
  {
    symbol: "GYRE",
    name: "Gyre Therapeutics, Inc.",
  },
  {
    symbol: "CDNA",
    name: "CareDx, Inc",
  },
  {
    symbol: "MOMO",
    name: "Hello Group Inc.",
  },
  {
    symbol: "ACMR",
    name: "ACM Research, Inc.",
  },
  {
    symbol: "CSWC",
    name: "Capital Southwest Corporation",
  },
  {
    symbol: "DCOM",
    name: "Dime Community Bancshares, Inc.",
  },
  {
    symbol: "KARO",
    name: "Karooooo Ltd.",
  },
  {
    symbol: "WLFC",
    name: "Willis Lease Finance Corporation",
  },
  {
    symbol: "SAFT",
    name: "Safety Insurance Group, Inc.",
  },
  {
    symbol: "IMKTA",
    name: "Ingles Markets, Incorporated",
  },
  {
    symbol: "GDYN",
    name: "Grid Dynamics Holdings, Inc.",
  },
  {
    symbol: "GABC",
    name: "German American Bancorp, Inc.",
  },
  {
    symbol: "COHU",
    name: "Cohu, Inc.",
  },
  {
    symbol: "AUTL",
    name: "Autolus Therapeutics plc",
  },
  {
    symbol: "SEZL",
    name: "Sezzle Inc.",
  },
  {
    symbol: "ANIP",
    name: "ANI Pharmaceuticals, Inc.",
  },
  {
    symbol: "PHVS",
    name: "Pharvaris N.V.",
  },
  {
    symbol: "INDV",
    name: "Indivior PLC",
  },
  {
    symbol: "PNTG",
    name: "The Pennant Group, Inc.",
  },
  {
    symbol: "ULH",
    name: "Universal Logistics Holdings, Inc.",
  },
  {
    symbol: "BTDR",
    name: "Bitdeer Technologies Group",
  },
  {
    symbol: "IMTX",
    name: "Immatics N.V.",
  },
  {
    symbol: "MSEX",
    name: "Middlesex Water Company",
  },
  {
    symbol: "TRNS",
    name: "Transcat, Inc.",
  },
  {
    symbol: "ALGT",
    name: "Allegiant Travel Company",
  },
  {
    symbol: "PFBC",
    name: "Preferred Bank",
  },
  {
    symbol: "PWP",
    name: "Perella Weinberg Partners",
  },
  {
    symbol: "FSUN",
    name: "FirstSun Capital Bancorp",
  },
  {
    symbol: "CCEC",
    name: "Capital Clean Energy Carriers Corp.",
  },
  {
    symbol: "HDL",
    name: "Super Hi International Holding Ltd.",
  },
  {
    symbol: "PDFS",
    name: "PDF Solutions, Inc.",
  },
  {
    symbol: "KRNT",
    name: "Kornit Digital Ltd.",
  },
  {
    symbol: "AMPL",
    name: "Amplitude, Inc.",
  },
  {
    symbol: "PLYA",
    name: "Playa Hotels & Resorts N.V.",
  },
  {
    symbol: "TRS",
    name: "TriMas Corporation",
  },
  {
    symbol: "PHAT",
    name: "Phathom Pharmaceuticals, Inc.",
  },
  {
    symbol: "COLL",
    name: "Collegium Pharmaceutical, Inc.",
  },
  {
    symbol: "XPEL",
    name: "XPEL, Inc.",
  },
  {
    symbol: "PLSE",
    name: "Pulse Biosciences, Inc.",
  },
  {
    symbol: "DGII",
    name: "Digi International Inc.",
  },
  {
    symbol: "HIMX",
    name: "Himax Technologies, Inc.",
  },
  {
    symbol: "ECPG",
    name: "Encore Capital Group, Inc.",
  },
  {
    symbol: "SCSC",
    name: "ScanSource, Inc.",
  },
  {
    symbol: "PEBO",
    name: "Peoples Bancorp Inc.",
  },
  {
    symbol: "SBGI",
    name: "Sinclair, Inc.",
  },
  {
    symbol: "RZLV",
    name: "Rezolve AI Limited",
  },
  {
    symbol: "JBSS",
    name: "John B. Sanfilippo & Son, Inc.",
  },
  {
    symbol: "CBRL",
    name: "Cracker Barrel Old Country Store, Inc.",
  },
  {
    symbol: "TILE",
    name: "Interface, Inc.",
  },
  {
    symbol: "AMSF",
    name: "AMERISAFE, Inc.",
  },
  {
    symbol: "KALU",
    name: "Kaiser Aluminum Corporation",
  },
  {
    symbol: "KRUS",
    name: "Kura Sushi USA, Inc.",
  },
  {
    symbol: "ATSG",
    name: "Air Transport Services Group, Inc.",
  },
  {
    symbol: "TASK",
    name: "TaskUs, Inc.",
  },
  {
    symbol: "GCT",
    name: "GigaCloud Technology Inc.",
  },
  {
    symbol: "SDA",
    name: "SunCar Technology Group Inc.",
  },
  {
    symbol: "OCFC",
    name: "OceanFirst Financial Corp.",
  },
  {
    symbol: "AVBP",
    name: "ArriVent BioPharma, Inc.",
  },
  {
    symbol: "ORKA",
    name: "Oruka Therapeutics, Inc.",
  },
  {
    symbol: "BELFB",
    name: "Bel Fuse Inc.",
  },
  {
    symbol: "EH",
    name: "EHang Holdings Limited",
  },
  {
    symbol: "ERII",
    name: "Energy Recovery, Inc.",
  },
  {
    symbol: "AOSL",
    name: "Alpha and Omega Semiconductor Limited",
  },
  {
    symbol: "AMAL",
    name: "Amalgamated Financial Corp.",
  },
  {
    symbol: "QNST",
    name: "QuinStreet, Inc.",
  },
  {
    symbol: "ODP",
    name: "The ODP Corporation",
  },
  {
    symbol: "APLT",
    name: "Applied Therapeutics, Inc.",
  },
  {
    symbol: "ASTL",
    name: "Algoma Steel Group Inc.",
  },
  {
    symbol: "HEPS",
    name: "D-Market Elektronik Hizmetler ve Ticaret A.S.",
  },
  {
    symbol: "FWRD",
    name: "Forward Air Corporation",
  },
  {
    symbol: "MRVI",
    name: "Maravai LifeSciences Holdings, Inc.",
  },
  {
    symbol: "REAX",
    name: "The Real Brokerage Inc.",
  },
  {
    symbol: "AUPH",
    name: "Aurinia Pharmaceuticals Inc.",
  },
  {
    symbol: "RLAY",
    name: "Relay Therapeutics, Inc.",
  },
  {
    symbol: "VIR",
    name: "Vir Biotechnology, Inc.",
  },
  {
    symbol: "FWRG",
    name: "First Watch Restaurant Group, Inc.",
  },
  {
    symbol: "BLFS",
    name: "BioLife Solutions, Inc.",
  },
  {
    symbol: "EOLS",
    name: "Evolus, Inc.",
  },
  {
    symbol: "ADV",
    name: "Advantage Solutions Inc.",
  },
  {
    symbol: "SBSI",
    name: "Southside Bancshares, Inc.",
  },
  {
    symbol: "ARQT",
    name: "Arcutis Biotherapeutics, Inc.",
  },
  {
    symbol: "NYAX",
    name: "Nayax Ltd.",
  },
  {
    symbol: "ZBIO",
    name: "Zenas BioPharma, Inc.",
  },
  {
    symbol: "MESO",
    name: "Mesoblast Limited",
  },
  {
    symbol: "ANAB",
    name: "AnaptysBio, Inc.",
  },
  {
    symbol: "OPK",
    name: "OPKO Health, Inc.",
  },
  {
    symbol: "SCVL",
    name: "Shoe Carnival, Inc.",
  },
  {
    symbol: "AVAH",
    name: "Aveanna Healthcare Holdings Inc.",
  },
  {
    symbol: "TIGR",
    name: "UP Fintech Holding Limited",
  },
  {
    symbol: "CAPR",
    name: "Capricor Therapeutics, Inc.",
  },
  {
    symbol: "BHRB",
    name: "Burke & Herbert Financial Services Corp.",
  },
  {
    symbol: "XMTR",
    name: "Xometry, Inc.",
  },
  {
    symbol: "HTZ",
    name: "Hertz Global Holdings, Inc.",
  },
  {
    symbol: "FIP",
    name: "FTAI Infrastructure Inc.",
  },
  {
    symbol: "EVGO",
    name: "EVgo, Inc.",
  },
  {
    symbol: "BBSI",
    name: "Barrett Business Services, Inc.",
  },
  {
    symbol: "PAHC",
    name: "Phibro Animal Health Corporation",
  },
  {
    symbol: "CRGX",
    name: "CARGO Therapeutics, Inc.",
  },
  {
    symbol: "CNOB",
    name: "ConnectOne Bancorp, Inc.",
  },
  {
    symbol: "CBLL",
    name: "CeriBell, Inc.",
  },
  {
    symbol: "CTBI",
    name: "Community Trust Bancorp, Inc.",
  },
  {
    symbol: "CMCO",
    name: "Columbus McKinnon Corporation",
  },
  {
    symbol: "IGMS",
    name: "IGM Biosciences, Inc.",
  },
  {
    symbol: "ARRY",
    name: "Array Technologies, Inc.",
  },
  {
    symbol: "BRKL",
    name: "Brookline Bancorp, Inc.",
  },
  {
    symbol: "RDWR",
    name: "Radware Ltd.",
  },
  {
    symbol: "LQDA",
    name: "Liquidia Corporation",
  },
  {
    symbol: "FLX",
    name: "BingEx Limited",
  },
  {
    symbol: "FMBH",
    name: "First Mid Bancshares, Inc.",
  },
  {
    symbol: "CECO",
    name: "CECO Environmental Corp.",
  },
  {
    symbol: "BMBL",
    name: "Bumble Inc.",
  },
  {
    symbol: "CGEM",
    name: "Cullinan Therapeutics, Inc.",
  },
  {
    symbol: "PETQ",
    name: "PetIQ, Inc.",
  },
  {
    symbol: "BFC",
    name: "Bank First Corporation",
  },
  {
    symbol: "ZYME",
    name: "Zymeworks Inc.",
  },
  {
    symbol: "AMRK",
    name: "A-Mark Precious Metals, Inc.",
  },
  {
    symbol: "LMB",
    name: "Limbach Holdings, Inc.",
  },
  {
    symbol: "ICHR",
    name: "Ichor Holdings, Ltd.",
  },
  {
    symbol: "RAPP",
    name: "Rapport Therapeutics, Inc.",
  },
  {
    symbol: "GOGO",
    name: "Gogo Inc.",
  },
  {
    symbol: "JACK",
    name: "Jack in the Box Inc.",
  },
  {
    symbol: "AMSC",
    name: "American Superconductor Corporation",
  },
  {
    symbol: "BITF",
    name: "Bitfarms Ltd.",
  },
  {
    symbol: "HTLD",
    name: "Heartland Express, Inc.",
  },
  {
    symbol: "ACDC",
    name: "ProFrac Holding Corp.",
  },
  {
    symbol: "VNET",
    name: "VNET Group, Inc.",
  },
  {
    symbol: "CGBD",
    name: "Carlyle Secured Lending, Inc.",
  },
  {
    symbol: "CSTL",
    name: "Castle Biosciences, Inc.",
  },
  {
    symbol: "PRTA",
    name: "Prothena Corporation plc",
  },
  {
    symbol: "IGIC",
    name: "International General Insurance Holdings Ltd.",
  },
  {
    symbol: "BVS",
    name: "Bioventus Inc.",
  },
  {
    symbol: "CFFN",
    name: "Capitol Federal Financial, Inc.",
  },
  {
    symbol: "SEDG",
    name: "SolarEdge Technologies, Inc.",
  },
  {
    symbol: "NRDS",
    name: "NerdWallet, Inc.",
  },
  {
    symbol: "PFC",
    name: "Premier Financial Corp.",
  },
  {
    symbol: "GDEN",
    name: "Golden Entertainment, Inc.",
  },
  {
    symbol: "HSTM",
    name: "HealthStream, Inc.",
  },
  {
    symbol: "SHLS",
    name: "Shoals Technologies Group, Inc.",
  },
  {
    symbol: "CRON",
    name: "Cronos Group Inc.",
  },
  {
    symbol: "BIOA",
    name: "BioAge Labs, Inc.",
  },
  {
    symbol: "AVO",
    name: "Mission Produce, Inc.",
  },
  {
    symbol: "SANA",
    name: "Sana Biotechnology, Inc.",
  },
  {
    symbol: "SLRC",
    name: "SLR Investment Corp.",
  },
  {
    symbol: "SLN",
    name: "Silence Therapeutics plc",
  },
  {
    symbol: "TTGT",
    name: "TechTarget, Inc.",
  },
  {
    symbol: "MDXG",
    name: "MiMedx Group, Inc.",
  },
  {
    symbol: "UXIN",
    name: "Uxin Limited",
  },
  {
    symbol: "DHC",
    name: "Diversified Healthcare Trust",
  },
  {
    symbol: "PLRX",
    name: "Pliant Therapeutics, Inc.",
  },
  {
    symbol: "PGY",
    name: "Pagaya Technologies Ltd.",
  },
  {
    symbol: "BASE",
    name: "Couchbase, Inc.",
  },
  {
    symbol: "BJRI",
    name: "BJ's Restaurants, Inc.",
  },
  {
    symbol: "MNRO",
    name: "Monro, Inc.",
  },
  {
    symbol: "UVSP",
    name: "Univest Financial Corporation",
  },
  {
    symbol: "ETNB",
    name: "89bio, Inc.",
  },
  {
    symbol: "SHEN",
    name: "Shenandoah Telecommunications Company",
  },
  {
    symbol: "DNTH",
    name: "Dianthus Therapeutics, Inc.",
  },
  {
    symbol: "REPL",
    name: "Replimune Group, Inc.",
  },
  {
    symbol: "IMOS",
    name: "ChipMOS TECHNOLOGIES INC.",
  },
  {
    symbol: "GSM",
    name: "Ferroglobe PLC",
  },
  {
    symbol: "FUFU",
    name: "BitFuFu Inc.",
  },
  {
    symbol: "EGBN",
    name: "Eagle Bancorp, Inc.",
  },
  {
    symbol: "EMBC",
    name: "Embecta Corp.",
  },
  {
    symbol: "CSIQ",
    name: "Canadian Solar Inc.",
  },
  {
    symbol: "CCB",
    name: "Coastal Financial Corporation",
  },
  {
    symbol: "MNTK",
    name: "Montauk Renewables, Inc.",
  },
  {
    symbol: "PTLO",
    name: "Portillo's Inc.",
  },
  {
    symbol: "ABCL",
    name: "AbCellera Biologics Inc.",
  },
  {
    symbol: "PENG",
    name: "Penguin Solutions, Inc.",
  },
  {
    symbol: "MBUU",
    name: "Malibu Boats, Inc.",
  },
  {
    symbol: "GLDD",
    name: "Great Lakes Dredge & Dock Corporation",
  },
  {
    symbol: "ARKO",
    name: "Arko Corp.",
  },
  {
    symbol: "INNV",
    name: "InnovAge Holding Corp.",
  },
  {
    symbol: "HSII",
    name: "Heidrick & Struggles International, Inc.",
  },
  {
    symbol: "ANNX",
    name: "Annexon, Inc.",
  },
  {
    symbol: "HCSG",
    name: "Healthcare Services Group, Inc.",
  },
  {
    symbol: "PCRX",
    name: "Pacira BioSciences, Inc.",
  },
  {
    symbol: "NBBK",
    name: "NB Bancorp, Inc.",
  },
  {
    symbol: "VMEO",
    name: "Vimeo, Inc.",
  },
  {
    symbol: "CFB",
    name: "CrossFirst Bankshares, Inc.",
  },
  {
    symbol: "DXPE",
    name: "DXP Enterprises, Inc.",
  },
  {
    symbol: "MBX",
    name: "MBX Biosciences, Inc.",
  },
  {
    symbol: "FCBC",
    name: "First Community Bankshares, Inc.",
  },
  {
    symbol: "HFWA",
    name: "Heritage Financial Corporation",
  },
  {
    symbol: "HAYN",
    name: "Haynes International, Inc.",
  },
  {
    symbol: "EYE",
    name: "National Vision Holdings, Inc.",
  },
  {
    symbol: "ABUS",
    name: "Arbutus Biopharma Corporation",
  },
  {
    symbol: "MCBS",
    name: "MetroCity Bankshares, Inc.",
  },
  {
    symbol: "TH",
    name: "Target Hospitality Corp.",
  },
  {
    symbol: "SWIM",
    name: "Latham Group, Inc.",
  },
  {
    symbol: "EU",
    name: "enCore Energy Corp.",
  },
  {
    symbol: "PRAA",
    name: "PRA Group, Inc.",
  },
  {
    symbol: "SBC",
    name: "SBC Medical Group Holdings Incorporated",
  },
  {
    symbol: "GDEV",
    name: "GDEV Inc.",
  },
  {
    symbol: "HAIN",
    name: "The Hain Celestial Group, Inc.",
  },
  {
    symbol: "SCWX",
    name: "SecureWorks Corp.",
  },
  {
    symbol: "OSBC",
    name: "Old Second Bancorp, Inc.",
  },
  {
    symbol: "BFST",
    name: "Business First Bancshares, Inc.",
  },
  {
    symbol: "PUBM",
    name: "PubMatic, Inc.",
  },
  {
    symbol: "ATEC",
    name: "Alphatec Holdings, Inc.",
  },
  {
    symbol: "TRIN",
    name: "Trinity Capital Inc.",
  },
  {
    symbol: "ORRF",
    name: "Orrstown Financial Services, Inc.",
  },
  {
    symbol: "ERAS",
    name: "Erasca, Inc.",
  },
  {
    symbol: "ADSE",
    name: "ADS-TEC Energy PLC",
  },
  {
    symbol: "HUMA",
    name: "Humacyte, Inc.",
  },
  {
    symbol: "IMNM",
    name: "Immunome, Inc.",
  },
  {
    symbol: "TIPT",
    name: "Tiptree Inc.",
  },
  {
    symbol: "DOGZ",
    name: "Dogness (International) Corporation",
  },
  {
    symbol: "CRMD",
    name: "CorMedix Inc.",
  },
  {
    symbol: "SPTN",
    name: "SpartanNash Company",
  },
  {
    symbol: "TREE",
    name: "LendingTree, Inc.",
  },
  {
    symbol: "TCPC",
    name: "BlackRock TCP Capital Corp.",
  },
  {
    symbol: "AAOI",
    name: "Applied Optoelectronics, Inc.",
  },
  {
    symbol: "GPRE",
    name: "Green Plains Inc.",
  },
  {
    symbol: "MBWM",
    name: "Mercantile Bank Corporation",
  },
  {
    symbol: "DDI",
    name: "DoubleDown Interactive Co., Ltd.",
  },
  {
    symbol: "STKL",
    name: "SunOpta Inc.",
  },
  {
    symbol: "KELYA",
    name: "Kelly Services, Inc.",
  },
  {
    symbol: "TRML",
    name: "Tourmaline Bio, Inc.",
  },
  {
    symbol: "HBNC",
    name: "Horizon Bancorp, Inc.",
  },
  {
    symbol: "NBN",
    name: "Northeast Bank",
  },
  {
    symbol: "KELYB",
    name: "Kelly Services, Inc.",
  },
  {
    symbol: "SCHL",
    name: "Scholastic Corporation",
  },
  {
    symbol: "ASTE",
    name: "Astec Industries, Inc.",
  },
  {
    symbol: "GOOD",
    name: "Gladstone Commercial Corporation",
  },
  {
    symbol: "HAFC",
    name: "Hanmi Financial Corporation",
  },
  {
    symbol: "STGW",
    name: "Stagwell Inc.",
  },
  {
    symbol: "LENZ",
    name: "LENZ Therapeutics, Inc.",
  },
  {
    symbol: "HCKT",
    name: "The Hackett Group, Inc.",
  },
  {
    symbol: "MATW",
    name: "Matthews International Corporation",
  },
  {
    symbol: "CCAP",
    name: "Crescent Capital BDC, Inc.",
  },
  {
    symbol: "GSBC",
    name: "Great Southern Bancorp, Inc.",
  },
  {
    symbol: "IBCP",
    name: "Independent Bank Corporation",
  },
  {
    symbol: "OPT",
    name: "Opthea Limited",
  },
  {
    symbol: "HBT",
    name: "HBT Financial, Inc.",
  },
  {
    symbol: "AIOT",
    name: "PowerFleet, Inc.",
  },
  {
    symbol: "ABL",
    name: "Abacus Life, Inc.",
  },
  {
    symbol: "EOSE",
    name: "Eos Energy Enterprises, Inc.",
  },
  {
    symbol: "PPTA",
    name: "Perpetua Resources Corp.",
  },
  {
    symbol: "MLYS",
    name: "Mineralys Therapeutics, Inc.",
  },
  {
    symbol: "TNGX",
    name: "Tango Therapeutics, Inc.",
  },
  {
    symbol: "NCMI",
    name: "National CineMedia, Inc.",
  },
  {
    symbol: "DJCO",
    name: "Daily Journal Corporation",
  },
  {
    symbol: "OLMA",
    name: "Olema Pharmaceuticals, Inc.",
  },
  {
    symbol: "MREO",
    name: "Mereo BioPharma Group plc",
  },
  {
    symbol: "RPAY",
    name: "Repay Holdings Corporation",
  },
  {
    symbol: "ADPT",
    name: "Adaptive Biotechnologies Corporation",
  },
  {
    symbol: "OCS",
    name: "Oculis Holding AG",
  },
  {
    symbol: "LXRX",
    name: "Lexicon Pharmaceuticals, Inc.",
  },
  {
    symbol: "CTLP",
    name: "Cantaloupe, Inc.",
  },
  {
    symbol: "GEVO",
    name: "Gevo, Inc.",
  },
  {
    symbol: "DMRC",
    name: "Digimarc Corporation",
  },
  {
    symbol: "ATXS",
    name: "Astria Therapeutics, Inc.",
  },
  {
    symbol: "CRSR",
    name: "Corsair Gaming, Inc.",
  },
  {
    symbol: "LQDT",
    name: "Liquidity Services, Inc.",
  },
  {
    symbol: "FDUS",
    name: "Fidus Investment Corporation",
  },
  {
    symbol: "SMBC",
    name: "Southern Missouri Bancorp, Inc.",
  },
  {
    symbol: "YMAB",
    name: "Y-mAbs Therapeutics, Inc.",
  },
  {
    symbol: "CDMO",
    name: "Avid Bioservices, Inc.",
  },
  {
    symbol: "ALMS",
    name: "Alumis Inc.",
  },
  {
    symbol: "SNCY",
    name: "Sun Country Airlines Holdings, Inc.",
  },
  {
    symbol: "ABVX",
    name: "ABIVAX Société Anonyme",
  },
  {
    symbol: "FSBC",
    name: "Five Star Bancorp",
  },
  {
    symbol: "RBBN",
    name: "Ribbon Communications Inc.",
  },
  {
    symbol: "EVLV",
    name: "Evolv Technologies Holdings, Inc.",
  },
  {
    symbol: "LPRO",
    name: "Open Lending Corporation",
  },
  {
    symbol: "LAB",
    name: "Standard BioTools Inc.",
  },
  {
    symbol: "CRESY",
    name: "Cresud Sociedad Anónima, Comercial, Inmobiliaria, Financiera y Agropecuaria",
  },
  {
    symbol: "IRMD",
    name: "IRADIMED CORPORATION",
  },
  {
    symbol: "WRLD",
    name: "World Acceptance Corporation",
  },
  {
    symbol: "IRWD",
    name: "Ironwood Pharmaceuticals, Inc.",
  },
  {
    symbol: "THRY",
    name: "Thryv Holdings, Inc.",
  },
  {
    symbol: "STOK",
    name: "Stoke Therapeutics, Inc.",
  },
  {
    symbol: "KRRO",
    name: "Korro Bio, Inc.",
  },
  {
    symbol: "ATRO",
    name: "Astronics Corporation",
  },
  {
    symbol: "MLAB",
    name: "Mesa Laboratories, Inc.",
  },
  {
    symbol: "CTKB",
    name: "Cytek Biosciences, Inc.",
  },
  {
    symbol: "TRST",
    name: "TrustCo Bank Corp NY",
  },
  {
    symbol: "EVER",
    name: "EverQuote, Inc.",
  },
  {
    symbol: "NGNE",
    name: "Neurogene Inc.",
  },
  {
    symbol: "EZPW",
    name: "EZCORP, Inc.",
  },
  {
    symbol: "FNKO",
    name: "Funko, Inc.",
  },
  {
    symbol: "CLNE",
    name: "Clean Energy Fuels Corp.",
  },
  {
    symbol: "SLP",
    name: "Simulations Plus, Inc.",
  },
  {
    symbol: "EXAI",
    name: "Exscientia plc",
  },
  {
    symbol: "KIDS",
    name: "OrthoPediatrics Corp.",
  },
  {
    symbol: "WLDN",
    name: "Willdan Group, Inc.",
  },
  {
    symbol: "SVC",
    name: "Service Properties Trust",
  },
  {
    symbol: "LEGH",
    name: "Legacy Housing Corporation",
  },
  {
    symbol: "PLPC",
    name: "Preformed Line Products Company",
  },
  {
    symbol: "ATEX",
    name: "Anterix Inc.",
  },
  {
    symbol: "ECX",
    name: "ECARX Holdings Inc.",
  },
  {
    symbol: "FFWM",
    name: "First Foundation Inc.",
  },
  {
    symbol: "INDI",
    name: "indie Semiconductor, Inc.",
  },
  {
    symbol: "DAKT",
    name: "Daktronics, Inc.",
  },
  {
    symbol: "CVAC",
    name: "CureVac N.V.",
  },
  {
    symbol: "ACIC",
    name: "American Coastal Insurance Corporation",
  },
  {
    symbol: "WEST",
    name: "Westrock Coffee Company",
  },
  {
    symbol: "OFIX",
    name: "Orthofix Medical Inc.",
  },
  {
    symbol: "CNDT",
    name: "Conduent Incorporated",
  },
  {
    symbol: "KC",
    name: "Kingsoft Cloud Holdings Limited",
  },
  {
    symbol: "CAC",
    name: "Camden National Corporation",
  },
  {
    symbol: "SLRN",
    name: "Acelyrin, Inc.",
  },
  {
    symbol: "ORIC",
    name: "ORIC Pharmaceuticals, Inc.",
  },
  {
    symbol: "CCBG",
    name: "Capital City Bank Group, Inc.",
  },
  {
    symbol: "WASH",
    name: "Washington Trust Bancorp, Inc.",
  },
  {
    symbol: "HTBK",
    name: "Heritage Commerce Corp",
  },
  {
    symbol: "TRDA",
    name: "Entrada Therapeutics, Inc.",
  },
  {
    symbol: "BTBT",
    name: "Bit Digital, Inc.",
  },
  {
    symbol: "MOFG",
    name: "MidWestOne Financial Group, Inc.",
  },
  {
    symbol: "CELC",
    name: "Celcuity Inc.",
  },
  {
    symbol: "AXGN",
    name: "Axogen, Inc.",
  },
  {
    symbol: "ROOT",
    name: "Root, Inc.",
  },
  {
    symbol: "HTBI",
    name: "HomeTrust Bancshares, Inc.",
  },
  {
    symbol: "SWBI",
    name: "Smith & Wesson Brands, Inc.",
  },
  {
    symbol: "FLGT",
    name: "Fulgent Genetics, Inc.",
  },
  {
    symbol: "NTGR",
    name: "NETGEAR, Inc.",
  },
  {
    symbol: "HSAI",
    name: "Hesai Group",
  },
  {
    symbol: "QTTB",
    name: "Q32 Bio Inc.",
  },
  {
    symbol: "IMXI",
    name: "International Money Express, Inc.",
  },
  {
    symbol: "CASS",
    name: "Cass Information Systems, Inc.",
  },
  {
    symbol: "TERN",
    name: "Terns Pharmaceuticals, Inc.",
  },
  {
    symbol: "RXT",
    name: "Rackspace Technology, Inc.",
  },
  {
    symbol: "HIFS",
    name: "Hingham Institution for Savings",
  },
  {
    symbol: "FRPH",
    name: "FRP Holdings, Inc.",
  },
  {
    symbol: "SNDL",
    name: "SNDL Inc.",
  },
  {
    symbol: "CEVA",
    name: "CEVA, Inc.",
  },
  {
    symbol: "AURA",
    name: "Aura Biosciences, Inc.",
  },
  {
    symbol: "RVNC",
    name: "Revance Therapeutics, Inc.",
  },
  {
    symbol: "INOD",
    name: "Innodata Inc.",
  },
  {
    symbol: "NNE",
    name: "NANO Nuclear Energy Inc.",
  },
  {
    symbol: "SPFI",
    name: "South Plains Financial, Inc.",
  },
  {
    symbol: "PGC",
    name: "Peapack-Gladstone Financial Corporation",
  },
  {
    symbol: "PHAR",
    name: "Pharming Group N.V.",
  },
  {
    symbol: "SVRA",
    name: "Savara Inc.",
  },
  {
    symbol: "CNSL",
    name: "Consolidated Communications Holdings, Inc.",
  },
  {
    symbol: "LESL",
    name: "Leslie's, Inc.",
  },
  {
    symbol: "OSPN",
    name: "OneSpan Inc.",
  },
  {
    symbol: "SRDX",
    name: "Surmodics, Inc.",
  },
  {
    symbol: "IPX",
    name: "IperionX Limited",
  },
  {
    symbol: "IIIV",
    name: "i3 Verticals, Inc.",
  },
  {
    symbol: "ATLC",
    name: "Atlanticus Holdings Corporation",
  },
  {
    symbol: "MGIC",
    name: "Magic Software Enterprises Ltd.",
  },
  {
    symbol: "METC",
    name: "Ramaco Resources, Inc.",
  },
  {
    symbol: "VINP",
    name: "Vinci Partners Investments Ltd.",
  },
  {
    symbol: "NEXN",
    name: "Nexxen International Ltd.",
  },
  {
    symbol: "THRD",
    name: "Third Harmonic Bio, Inc.",
  },
  {
    symbol: "KRT",
    name: "Karat Packaging Inc.",
  },
  {
    symbol: "TECX",
    name: "Tectonic Therapeutic, Inc.",
  },
  {
    symbol: "ITRN",
    name: "Ituran Location and Control Ltd.",
  },
  {
    symbol: "PRME",
    name: "Prime Medicine, Inc.",
  },
  {
    symbol: "CRML",
    name: "Critical Metals Corp.",
  },
  {
    symbol: "ALLO",
    name: "Allogene Therapeutics, Inc.",
  },
  {
    symbol: "RSVR",
    name: "Reservoir Media, Inc.",
  },
  {
    symbol: "CCNE",
    name: "CNB Financial Corporation",
  },
  {
    symbol: "GLAD",
    name: "Gladstone Capital Corporation",
  },
  {
    symbol: "DGICA",
    name: "Donegal Group Inc.",
  },
  {
    symbol: "RNAC",
    name: "Cartesian Therapeutics, Inc.",
  },
  {
    symbol: "GCMG",
    name: "GCM Grosvenor Inc.",
  },
  {
    symbol: "SIBN",
    name: "SI-BONE, Inc.",
  },
  {
    symbol: "METCB",
    name: "Ramaco Resources, Inc.",
  },
  {
    symbol: "VREX",
    name: "Varex Imaging Corporation",
  },
  {
    symbol: "KALV",
    name: "KalVista Pharmaceuticals, Inc.",
  },
  {
    symbol: "FMNB",
    name: "Farmers National Banc Corp.",
  },
  {
    symbol: "SEAT",
    name: "Vivid Seats Inc.",
  },
  {
    symbol: "MPB",
    name: "Mid Penn Bancorp, Inc.",
  },
  {
    symbol: "LX",
    name: "LexinFintech Holdings Ltd.",
  },
  {
    symbol: "YORW",
    name: "The York Water Company",
  },
  {
    symbol: "CLFD",
    name: "Clearfield, Inc.",
  },
  {
    symbol: "GAIN",
    name: "Gladstone Investment Corporation",
  },
  {
    symbol: "ESQ",
    name: "Esquire Financial Holdings, Inc.",
  },
  {
    symbol: "ARCT",
    name: "Arcturus Therapeutics Holdings Inc.",
  },
  {
    symbol: "NNDM",
    name: "Nano Dimension Ltd.",
  },
  {
    symbol: "LIND",
    name: "Lindblad Expeditions Holdings, Inc.",
  },
  {
    symbol: "EYPT",
    name: "EyePoint Pharmaceuticals, Inc.",
  },
  {
    symbol: "UFCS",
    name: "United Fire Group, Inc.",
  },
  {
    symbol: "URGN",
    name: "UroGen Pharma Ltd.",
  },
  {
    symbol: "FLWS",
    name: "1-800-FLOWERS.COM, Inc.",
  },
  {
    symbol: "LRMR",
    name: "Larimar Therapeutics, Inc.",
  },
  {
    symbol: "DAVE",
    name: "Dave Inc.",
  },
  {
    symbol: "RITR",
    name: "Reitar Logtech Holdings Limited",
  },
  {
    symbol: "NFBK",
    name: "Northfield Bancorp, Inc.",
  },
  {
    symbol: "SSYS",
    name: "Stratasys Ltd.",
  },
  {
    symbol: "OFLX",
    name: "Omega Flex, Inc.",
  },
  {
    symbol: "THFF",
    name: "First Financial Corporation",
  },
  {
    symbol: "LE",
    name: "Lands' End, Inc.",
  },
  {
    symbol: "AQST",
    name: "Aquestive Therapeutics, Inc.",
  },
  {
    symbol: "LUNR",
    name: "Intuitive Machines, Inc.",
  },
  {
    symbol: "LASR",
    name: "nLIGHT, Inc.",
  },
  {
    symbol: "DH",
    name: "Definitive Healthcare Corp.",
  },
  {
    symbol: "MSBI",
    name: "Midland States Bancorp, Inc.",
  },
  {
    symbol: "GCBC",
    name: "Greene County Bancorp, Inc.",
  },
  {
    symbol: "ADTN",
    name: "ADTRAN Holdings, Inc.",
  },
  {
    symbol: "LVRO",
    name: "Lavoro Limited",
  },
  {
    symbol: "SKYT",
    name: "SkyWater Technology, Inc.",
  },
  {
    symbol: "PRTC",
    name: "PureTech Health plc",
  },
  {
    symbol: "VERV",
    name: "Verve Therapeutics, Inc.",
  },
  {
    symbol: "BAND",
    name: "Bandwidth Inc.",
  },
  {
    symbol: "XERS",
    name: "Xeris Biopharma Holdings, Inc.",
  },
  {
    symbol: "CVGW",
    name: "Calavo Growers, Inc.",
  },
  {
    symbol: "VALU",
    name: "Value Line, Inc.",
  },
  {
    symbol: "SHBI",
    name: "Shore Bancshares, Inc.",
  },
  {
    symbol: "AROW",
    name: "Arrow Financial Corporation",
  },
  {
    symbol: "ALT",
    name: "Altimmune, Inc.",
  },
  {
    symbol: "CRVS",
    name: "Corvus Pharmaceuticals, Inc.",
  },
  {
    symbol: "SAGE",
    name: "Sage Therapeutics, Inc.",
  },
  {
    symbol: "LMNR",
    name: "Limoneira Company",
  },
  {
    symbol: "CGNT",
    name: "Cognyte Software Ltd.",
  },
  {
    symbol: "BLDP",
    name: "Ballard Power Systems Inc.",
  },
  {
    symbol: "HONE",
    name: "HarborOne Bancorp, Inc.",
  },
  {
    symbol: "DGICB",
    name: "Donegal Group Inc.",
  },
  {
    symbol: "NYMT",
    name: "New York Mortgage Trust, Inc.",
  },
  {
    symbol: "LAND",
    name: "Gladstone Land Corporation",
  },
  {
    symbol: "ACTG",
    name: "Acacia Research Corporation",
  },
  {
    symbol: "CGC",
    name: "Canopy Growth Corporation",
  },
  {
    symbol: "OTLY",
    name: "Oatly Group AB",
  },
  {
    symbol: "RGNX",
    name: "REGENXBIO Inc.",
  },
  {
    symbol: "GLRE",
    name: "Greenlight Capital Re, Ltd.",
  },
  {
    symbol: "INV",
    name: "Innventure, Inc.",
  },
  {
    symbol: "VALN",
    name: "Valneva SE",
  },
  {
    symbol: "PFIS",
    name: "Peoples Financial Services Corp.",
  },
  {
    symbol: "HCAT",
    name: "Health Catalyst, Inc.",
  },
  {
    symbol: "SIGA",
    name: "SIGA Technologies, Inc.",
  },
  {
    symbol: "PACB",
    name: "Pacific Biosciences of California, Inc.",
  },
  {
    symbol: "QTRX",
    name: "Quanterix Corporation",
  },
  {
    symbol: "ATNI",
    name: "ATN International, Inc.",
  },
  {
    symbol: "ABSI",
    name: "Absci Corporation",
  },
  {
    symbol: "ALRS",
    name: "Alerus Financial Corporation",
  },
  {
    symbol: "LYTS",
    name: "LSI Industries Inc.",
  },
  {
    symbol: "BCAL",
    name: "California BanCorp",
  },
  {
    symbol: "AEHR",
    name: "Aehr Test Systems, Inc.",
  },
  {
    symbol: "TALK",
    name: "Talkspace, Inc.",
  },
  {
    symbol: "NVTS",
    name: "Navitas Semiconductor Corporation",
  },
  {
    symbol: "CLMB",
    name: "Climb Global Solutions, Inc.",
  },
  {
    symbol: "RDUS",
    name: "Radius Recycling, Inc.",
  },
  {
    symbol: "TWFG",
    name: "TWFG, Inc.",
  },
  {
    symbol: "AVXL",
    name: "Anavex Life Sciences Corp.",
  },
  {
    symbol: "HIVE",
    name: "HIVE Digital Technologies Ltd.",
  },
  {
    symbol: "LOVE",
    name: "The Lovesac Company",
  },
  {
    symbol: "MGTX",
    name: "MeiraGTx Holdings plc",
  },
  {
    symbol: "MNMD",
    name: "Mind Medicine (MindMed) Inc.",
  },
  {
    symbol: "FTEL",
    name: "Fitell Corporation",
  },
  {
    symbol: "OABI",
    name: "OmniAb, Inc.",
  },
  {
    symbol: "ALEC",
    name: "Alector, Inc.",
  },
  {
    symbol: "ANSC",
    name: "Agriculture & Natural Solutions Acquisition Corporation",
  },
  {
    symbol: "SOHU",
    name: "Sohu.com Limited",
  },
  {
    symbol: "ITIC",
    name: "Investors Title Company",
  },
  {
    symbol: "KE",
    name: "Kimball Electronics, Inc.",
  },
  {
    symbol: "VLGEA",
    name: "Village Super Market, Inc.",
  },
  {
    symbol: "CMPS",
    name: "COMPASS Pathways plc",
  },
  {
    symbol: "KRNY",
    name: "Kearny Financial Corp.",
  },
  {
    symbol: "BIOX",
    name: "Bioceres Crop Solutions Corp.",
  },
  {
    symbol: "FFIC",
    name: "Flushing Financial Corporation",
  },
  {
    symbol: "TVGN",
    name: "Tevogen Bio Holdings Inc.",
  },
  {
    symbol: "NRC",
    name: "National Research Corporation",
  },
  {
    symbol: "SENEB",
    name: "Seneca Foods Corporation",
  },
  {
    symbol: "NWPX",
    name: "Northwest Pipe Company",
  },
  {
    symbol: "IONR",
    name: "ioneer Ltd",
  },
  {
    symbol: "GRVY",
    name: "Gravity Co., Ltd.",
  },
  {
    symbol: "SENEA",
    name: "Seneca Foods Corporation",
  },
  {
    symbol: "PGHL",
    name: "Primega Group Holdings Limited",
  },
  {
    symbol: "DHIL",
    name: "Diamond Hill Investment Group, Inc.",
  },
  {
    symbol: "MERC",
    name: "Mercer International Inc.",
  },
  {
    symbol: "LSAK",
    name: "Lesaka Technologies, Inc.",
  },
  {
    symbol: "FDMT",
    name: "4D Molecular Therapeutics, Inc.",
  },
  {
    symbol: "DADA",
    name: "Dada Nexus Limited",
  },
  {
    symbol: "FHTX",
    name: "Foghorn Therapeutics Inc.",
  },
  {
    symbol: "TBPH",
    name: "Theravance Biopharma, Inc.",
  },
  {
    symbol: "CARE",
    name: "Carter Bankshares, Inc.",
  },
  {
    symbol: "BYND",
    name: "Beyond Meat, Inc.",
  },
  {
    symbol: "BMEA",
    name: "Biomea Fusion, Inc.",
  },
  {
    symbol: "CTNM",
    name: "Contineum Therapeutics, Inc.",
  },
  {
    symbol: "LWLG",
    name: "Lightwave Logic, Inc.",
  },
  {
    symbol: "ZVRA",
    name: "Zevra Therapeutics, Inc.",
  },
  {
    symbol: "RMR",
    name: "The RMR Group Inc.",
  },
  {
    symbol: "BIGC",
    name: "BigCommerce Holdings, Inc.",
  },
  {
    symbol: "CCCC",
    name: "C4 Therapeutics, Inc.",
  },
  {
    symbol: "LSEA",
    name: "Landsea Homes Corporation",
  },
  {
    symbol: "PRTH",
    name: "Priority Technology Holdings, Inc.",
  },
  {
    symbol: "ZEUS",
    name: "Olympic Steel, Inc.",
  },
  {
    symbol: "BWB",
    name: "Bridgewater Bancshares, Inc.",
  },
  {
    symbol: "ZUMZ",
    name: "Zumiez Inc.",
  },
  {
    symbol: "HNRG",
    name: "Hallador Energy Company",
  },
  {
    symbol: "USAP",
    name: "Universal Stainless & Alloy Products, Inc.",
  },
  {
    symbol: "NETD",
    name: "Nabors Energy Transition Corp. II",
  },
  {
    symbol: "SERV",
    name: "Serve Robotics Inc.",
  },
  {
    symbol: "MITK",
    name: "Mitek Systems, Inc.",
  },
  {
    symbol: "BSRR",
    name: "Sierra Bancorp",
  },
  {
    symbol: "LAZR",
    name: "Luminar Technologies, Inc.",
  },
  {
    symbol: "ESPR",
    name: "Esperion Therapeutics, Inc.",
  },
  {
    symbol: "TSHA",
    name: "Taysha Gene Therapies, Inc.",
  },
  {
    symbol: "GRAL",
    name: "GRAIL, Inc.",
  },
  {
    symbol: "GRPN",
    name: "Groupon, Inc.",
  },
  {
    symbol: "RBB",
    name: "RBB Bancorp",
  },
  {
    symbol: "CBNK",
    name: "Capital Bancorp, Inc.",
  },
  {
    symbol: "RWAY",
    name: "Runway Growth Finance Corp.",
  },
  {
    symbol: "SHYF",
    name: "The Shyft Group, Inc.",
  },
  {
    symbol: "TCBX",
    name: "Third Coast Bancshares, Inc.",
  },
  {
    symbol: "BSVN",
    name: "Bank7 Corp.",
  },
  {
    symbol: "CCRN",
    name: "Cross Country Healthcare, Inc.",
  },
  {
    symbol: "NIPG",
    name: "NIP Group Inc.",
  },
  {
    symbol: "MXCT",
    name: "MaxCyte, Inc.",
  },
  {
    symbol: "BRY",
    name: "Berry Corporation",
  },
  {
    symbol: "LINC",
    name: "Lincoln Educational Services Corporation",
  },
  {
    symbol: "RDVT",
    name: "Red Violet, Inc.",
  },
  {
    symbol: "ENGN",
    name: "enGene Holdings Inc.",
  },
  {
    symbol: "GHRS",
    name: "GH Research PLC",
  },
  {
    symbol: "EBTC",
    name: "Enterprise Bancorp, Inc.",
  },
  {
    symbol: "LWAY",
    name: "Lifeway Foods, Inc.",
  },
  {
    symbol: "TWG",
    name: "Top Wealth Group Holding Limited",
  },
  {
    symbol: "ZIMV",
    name: "ZimVie Inc.",
  },
  {
    symbol: "CCSI",
    name: "Consensus Cloud Solutions, Inc.",
  },
  {
    symbol: "UNTY",
    name: "Unity Bancorp, Inc.",
  },
  {
    symbol: "VBNK",
    name: "VersaBank",
  },
  {
    symbol: "CWCO",
    name: "Consolidated Water Co. Ltd.",
  },
  {
    symbol: "RICK",
    name: "RCI Hospitality Holdings, Inc.",
  },
  {
    symbol: "FISI",
    name: "Financial Institutions, Inc.",
  },
  {
    symbol: "LNZA",
    name: "LanzaTech Global, Inc.",
  },
  {
    symbol: "ORGO",
    name: "Organogenesis Holdings Inc.",
  },
  {
    symbol: "PERI",
    name: "Perion Network Ltd.",
  },
  {
    symbol: "ALTI",
    name: "AlTi Global, Inc.",
  },
  {
    symbol: "LOCO",
    name: "El Pollo Loco Holdings, Inc.",
  },
  {
    symbol: "HBCP",
    name: "Home Bancorp, Inc.",
  },
  {
    symbol: "LIEN",
    name: "Chicago Atlantic BDC, Inc.",
  },
  {
    symbol: "PKOH",
    name: "Park-Ohio Holdings Corp.",
  },
  {
    symbol: "WALD",
    name: "Waldencast plc",
  },
  {
    symbol: "FBIZ",
    name: "First Business Financial Services, Inc.",
  },
  {
    symbol: "HRZN",
    name: "Horizon Technology Finance Corporation",
  },
  {
    symbol: "BWMN",
    name: "Bowman Consulting Group Ltd.",
  },
  {
    symbol: "CCIX",
    name: "Churchill Capital Corp IX",
  },
  {
    symbol: "NVEC",
    name: "NVE Corporation",
  },
  {
    symbol: "NYXH",
    name: "Nyxoah S.A.",
  },
  {
    symbol: "FMAO",
    name: "Farmers & Merchants Bancorp, Inc.",
  },
  {
    symbol: "ACNB",
    name: "ACNB Corporation",
  },
  {
    symbol: "NRIM",
    name: "Northrim BanCorp, Inc.",
  },
  {
    symbol: "HNST",
    name: "The Honest Company, Inc.",
  },
  {
    symbol: "CDRO",
    name: "Codere Online Luxembourg, S.A.",
  },
  {
    symbol: "JFIN",
    name: "Jiayin Group Inc.",
  },
  {
    symbol: "ANIK",
    name: "Anika Therapeutics, Inc.",
  },
  {
    symbol: "GPAT",
    name: "GP-Act III Acquisition Corp.",
  },
  {
    symbol: "GIG",
    name: "GigCapital7 Corp.",
  },
  {
    symbol: "RRBI",
    name: "Red River Bancshares, Inc.",
  },
  {
    symbol: "MBAV",
    name: "M3-Brigade Acquisition V Corp.",
  },
  {
    symbol: "ALF",
    name: "Centurion Acquisition Corp.",
  },
  {
    symbol: "VMD",
    name: "Viemed Healthcare, Inc.",
  },
  {
    symbol: "SDST",
    name: "Stardust Power Inc.",
  },
  {
    symbol: "VYGR",
    name: "Voyager Therapeutics, Inc.",
  },
  {
    symbol: "ISPR",
    name: "Ispire Technology Inc.",
  },
  {
    symbol: "FRBA",
    name: "First Bank",
  },
  {
    symbol: "AMCX",
    name: "AMC Networks Inc.",
  },
  {
    symbol: "ASPI",
    name: "ASP Isotopes Inc.",
  },
  {
    symbol: "ARTNA",
    name: "Artesian Resources Corporation",
  },
  {
    symbol: "MTLS",
    name: "Materialise NV",
  },
  {
    symbol: "BMRC",
    name: "Bank of Marin Bancorp",
  },
  {
    symbol: "HDSN",
    name: "Hudson Technologies, Inc.",
  },
  {
    symbol: "TKNO",
    name: "Alpha Teknova, Inc.",
  },
  {
    symbol: "CWBC",
    name: "Community West Bancshares",
  },
  {
    symbol: "GAMB",
    name: "Gambling.com Group Limited",
  },
  {
    symbol: "SFIX",
    name: "Stitch Fix, Inc.",
  },
  {
    symbol: "ZJYL",
    name: "Jin Medical International Ltd.",
  },
  {
    symbol: "LGTY",
    name: "Logility Supply Chain Solutions, Inc.",
  },
  {
    symbol: "AIRJ",
    name: "Montana Technologies Corporation",
  },
  {
    symbol: "WTBA",
    name: "West Bancorporation, Inc.",
  },
  {
    symbol: "CLPT",
    name: "ClearPoint Neuro, Inc.",
  },
  {
    symbol: "TRUE",
    name: "TrueCar, Inc.",
  },
  {
    symbol: "XOMA",
    name: "XOMA Royalty Corporation",
  },
  {
    symbol: "FSBW",
    name: "FS Bancorp, Inc.",
  },
  {
    symbol: "DCGO",
    name: "DocGo Inc.",
  },
  {
    symbol: "NEWT",
    name: "NewtekOne, Inc.",
  },
  {
    symbol: "UROY",
    name: "Uranium Royalty Corp.",
  },
  {
    symbol: "FARO",
    name: "FARO Technologies, Inc.",
  },
  {
    symbol: "NATH",
    name: "Nathan's Famous, Inc.",
  },
  {
    symbol: "NAUT",
    name: "Nautilus Biotechnology, Inc.",
  },
  {
    symbol: "HEAR",
    name: "Turtle Beach Corporation",
  },
  {
    symbol: "IPXX",
    name: "Inflection Point Acquisition Corp. II",
  },
  {
    symbol: "PTSI",
    name: "P.A.M. Transportation Services, Inc.",
  },
  {
    symbol: "NNOX",
    name: "Nano-X Imaging Ltd.",
  },
  {
    symbol: "AMLX",
    name: "Amylyx Pharmaceuticals, Inc.",
  },
  {
    symbol: "TCMD",
    name: "Tactile Systems Technology, Inc.",
  },
  {
    symbol: "CYRX",
    name: "Cryoport, Inc.",
  },
  {
    symbol: "TITN",
    name: "Titan Machinery Inc.",
  },
  {
    symbol: "AKBA",
    name: "Akebia Therapeutics, Inc.",
  },
  {
    symbol: "JOUT",
    name: "Johnson Outdoors Inc.",
  },
  {
    symbol: "NECB",
    name: "Northeast Community Bancorp, Inc.",
  },
  {
    symbol: "BTOC",
    name: "Armlogi Holding Corp.",
  },
  {
    symbol: "LXEO",
    name: "Lexeo Therapeutics, Inc.",
  },
  {
    symbol: "BYRN",
    name: "Byrna Technologies Inc.",
  },
  {
    symbol: "CRMT",
    name: "America's Car-Mart, Inc.",
  },
  {
    symbol: "EWCZ",
    name: "European Wax Center, Inc.",
  },
  {
    symbol: "NODK",
    name: "NI Holdings, Inc.",
  },
  {
    symbol: "WEYS",
    name: "Weyco Group, Inc.",
  },
  {
    symbol: "AIRS",
    name: "AirSculpt Technologies, Inc.",
  },
  {
    symbol: "REAL",
    name: "The RealReal, Inc.",
  },
  {
    symbol: "TMC",
    name: "TMC the metals company Inc.",
  },
  {
    symbol: "DENN",
    name: "Denny's Corporation",
  },
  {
    symbol: "FATE",
    name: "Fate Therapeutics, Inc.",
  },
  {
    symbol: "OBT",
    name: "Orange County Bancorp, Inc.",
  },
  {
    symbol: "ALDX",
    name: "Aldeyra Therapeutics, Inc.",
  },
  {
    symbol: "VACH",
    name: "Voyager Acquisition Corp.",
  },
  {
    symbol: "QURE",
    name: "uniQure N.V.",
  },
  {
    symbol: "APPS",
    name: "Digital Turbine, Inc.",
  },
  {
    symbol: "ITOS",
    name: "iTeos Therapeutics, Inc.",
  },
  {
    symbol: "MTRX",
    name: "Matrix Service Company",
  },
  {
    symbol: "ONEW",
    name: "OneWater Marine Inc.",
  },
  {
    symbol: "CLYM",
    name: "Climb Bio, Inc.",
  },
  {
    symbol: "SGMO",
    name: "Sangamo Therapeutics, Inc.",
  },
  {
    symbol: "RZLT",
    name: "Rezolute, Inc.",
  },
  {
    symbol: "BLZE",
    name: "Backblaze, Inc.",
  },
  {
    symbol: "ACB",
    name: "Aurora Cannabis Inc.",
  },
  {
    symbol: "ITI",
    name: "Iteris, Inc.",
  },
  {
    symbol: "KMDA",
    name: "Kamada Ltd.",
  },
  {
    symbol: "SNBR",
    name: "Sleep Number Corporation",
  },
  {
    symbol: "SFST",
    name: "Southern First Bancshares, Inc.",
  },
  {
    symbol: "INZY",
    name: "Inozyme Pharma, Inc.",
  },
  {
    symbol: "CUB",
    name: "Lionheart Holdings",
  },
  {
    symbol: "SSBK",
    name: "Southern States Bancshares, Inc.",
  },
  {
    symbol: "TMCI",
    name: "Treace Medical Concepts, Inc.",
  },
  {
    symbol: "JMSB",
    name: "John Marshall Bancorp, Inc.",
  },
  {
    symbol: "ZJK",
    name: "ZJK Industrial Co., Ltd.",
  },
  {
    symbol: "FRGT",
    name: "Freight Technologies, Inc.",
  },
  {
    symbol: "IBEX",
    name: "IBEX Limited",
  },
  {
    symbol: "SPOK",
    name: "Spok Holdings, Inc.",
  },
  {
    symbol: "COFS",
    name: "ChoiceOne Financial Services, Inc.",
  },
  {
    symbol: "DSGN",
    name: "Design Therapeutics, Inc.",
  },
  {
    symbol: "INBK",
    name: "First Internet Bancorp",
  },
  {
    symbol: "REFI",
    name: "Chicago Atlantic Real Estate Finance, Inc.",
  },
  {
    symbol: "CERS",
    name: "Cerus Corporation",
  },
  {
    symbol: "GTI",
    name: "Graphjet Technology",
  },
  {
    symbol: "JSPR",
    name: "Jasper Therapeutics, Inc.",
  },
  {
    symbol: "OSUR",
    name: "OraSure Technologies, Inc.",
  },
  {
    symbol: "GWRS",
    name: "Global Water Resources, Inc.",
  },
  {
    symbol: "GLUE",
    name: "Monte Rosa Therapeutics, Inc.",
  },
  {
    symbol: "FDBC",
    name: "Fidelity D & D Bancorp, Inc.",
  },
  {
    symbol: "ESEA",
    name: "Euroseas Ltd.",
  },
  {
    symbol: "FNLC",
    name: "The First Bancorp, Inc.",
  },
  {
    symbol: "DCTH",
    name: "Delcath Systems, Inc.",
  },
  {
    symbol: "PNRG",
    name: "PrimeEnergy Resources Corporation",
  },
  {
    symbol: "PFMT",
    name: "Performant Financial Corporation",
  },
  {
    symbol: "ACIU",
    name: "AC Immune SA",
  },
  {
    symbol: "FLXS",
    name: "Flexsteel Industries, Inc.",
  },
  {
    symbol: "DOMO",
    name: "Domo, Inc.",
  },
  {
    symbol: "SIMA",
    name: "SIM Acquisition Corp. I",
  },
  {
    symbol: "CZNC",
    name: "Citizens & Northern Corporation",
  },
  {
    symbol: "PANL",
    name: "Pangaea Logistics Solutions, Ltd.",
  },
  {
    symbol: "TTSH",
    name: "Tile Shop Holdings, Inc.",
  },
  {
    symbol: "POLE",
    name: "Andretti Acquisition Corp. II",
  },
  {
    symbol: "CAN",
    name: "Canaan Inc.",
  },
  {
    symbol: "BBCP",
    name: "Concrete Pumping Holdings, Inc.",
  },
  {
    symbol: "ZURA",
    name: "Zura Bio Limited",
  },
  {
    symbol: "ALNT",
    name: "Allient Inc.",
  },
  {
    symbol: "FRST",
    name: "Primis Financial Corp.",
  },
  {
    symbol: "USCB",
    name: "USCB Financial Holdings, Inc.",
  },
  {
    symbol: "IHRT",
    name: "iHeartMedia, Inc.",
  },
  {
    symbol: "ANGO",
    name: "AngioDynamics, Inc.",
  },
  {
    symbol: "HOND",
    name: "HCM II Acquisition Corp.",
  },
  {
    symbol: "MAMA",
    name: "Mama's Creations, Inc.",
  },
  {
    symbol: "FORR",
    name: "Forrester Research, Inc.",
  },
  {
    symbol: "FLIC",
    name: "The First of Long Island Corporation",
  },
  {
    symbol: "AVIR",
    name: "Atea Pharmaceuticals, Inc.",
  },
  {
    symbol: "IMMP",
    name: "Immutep Limited",
  },
  {
    symbol: "STRO",
    name: "Sutro Biopharma, Inc.",
  },
  {
    symbol: "CIVB",
    name: "Civista Bancshares, Inc.",
  },
  {
    symbol: "DOYU",
    name: "DouYu International Holdings Limited",
  },
  {
    symbol: "AFRI",
    name: "Forafric Global PLC",
  },
  {
    symbol: "PRQR",
    name: "ProQR Therapeutics N.V.",
  },
  {
    symbol: "PBFS",
    name: "Pioneer Bancorp, Inc.",
  },
  {
    symbol: "BLDE",
    name: "Blade Air Mobility, Inc.",
  },
  {
    symbol: "GILT",
    name: "Gilat Satellite Networks Ltd.",
  },
  {
    symbol: "LPBB",
    name: "Launch Two Acquisition Corp.",
  },
  {
    symbol: "LPAA",
    name: "Launch One Acquisition Corp.",
  },
  {
    symbol: "LYEL",
    name: "Lyell Immunopharma, Inc.",
  },
  {
    symbol: "MCFT",
    name: "MasterCraft Boat Holdings, Inc.",
  },
  {
    symbol: "WHF",
    name: "WhiteHorse Finance, Inc.",
  },
  {
    symbol: "CZFS",
    name: "Citizens Financial Services, Inc.",
  },
  {
    symbol: "RGP",
    name: "Resources Connection, Inc.",
  },
  {
    symbol: "CCIR",
    name: "Cohen Circle Acquisition Corp. I",
  },
  {
    symbol: "SMTI",
    name: "Sanara MedTech Inc.",
  },
  {
    symbol: "IMMR",
    name: "Immersion Corporation",
  },
  {
    symbol: "ABEO",
    name: "Abeona Therapeutics Inc.",
  },
  {
    symbol: "ASLE",
    name: "AerSale Corporation",
  },
  {
    symbol: "WSBF",
    name: "Waterstone Financial, Inc.",
  },
  {
    symbol: "JAKK",
    name: "JAKKS Pacific, Inc.",
  },
  {
    symbol: "AUDC",
    name: "AudioCodes Ltd.",
  },
  {
    symbol: "VCIC",
    name: "Vine Hill Capital Investment Corp.",
  },
  {
    symbol: "AEYE",
    name: "AudioEye, Inc.",
  },
  {
    symbol: "HMST",
    name: "HomeStreet, Inc.",
  },
  {
    symbol: "UHG",
    name: "United Homes Group, Inc.",
  },
  {
    symbol: "ZYXI",
    name: "Zynex, Inc.",
  },
  {
    symbol: "GNFT",
    name: "Genfit S.A.",
  },
  {
    symbol: "GMGI",
    name: "Golden Matrix Group, Inc.",
  },
  {
    symbol: "POET",
    name: "POET Technologies Inc.",
  },
  {
    symbol: "AIP",
    name: "Arteris, Inc.",
  },
  {
    symbol: "HRTX",
    name: "Heron Therapeutics, Inc.",
  },
  {
    symbol: "BCML",
    name: "BayCom Corp",
  },
  {
    symbol: "ILPT",
    name: "Industrial Logistics Properties Trust",
  },
  {
    symbol: "PEPG",
    name: "PepGen Inc.",
  },
  {
    symbol: "PSNL",
    name: "Personalis, Inc.",
  },
  {
    symbol: "RAIL",
    name: "FreightCar America, Inc.",
  },
  {
    symbol: "RCEL",
    name: "AVITA Medical, Inc.",
  },
  {
    symbol: "CBAN",
    name: "Colony Bankcorp, Inc.",
  },
  {
    symbol: "AVNW",
    name: "Aviat Networks, Inc.",
  },
  {
    symbol: "EPIX",
    name: "ESSA Pharma Inc.",
  },
  {
    symbol: "IRBT",
    name: "iRobot Corporation",
  },
  {
    symbol: "SGHT",
    name: "Sight Sciences, Inc.",
  },
  {
    symbol: "VNDA",
    name: "Vanda Pharmaceuticals Inc.",
  },
  {
    symbol: "TCRX",
    name: "TScan Therapeutics, Inc.",
  },
  {
    symbol: "EDIT",
    name: "Editas Medicine, Inc.",
  },
  {
    symbol: "SLAM",
    name: "Slam Corp.",
  },
  {
    symbol: "CDXC",
    name: "ChromaDex Corporation",
  },
  {
    symbol: "JRVR",
    name: "James River Group Holdings, Ltd.",
  },
  {
    symbol: "MVBF",
    name: "MVB Financial Corp.",
  },
  {
    symbol: "TTEC",
    name: "TTEC Holdings, Inc.",
  },
  {
    symbol: "ALDF",
    name: "Aldel Financial II Inc.",
  },
  {
    symbol: "PGEN",
    name: "Precigen, Inc.",
  },
  {
    symbol: "PDLB",
    name: "Ponce Financial Group, Inc.",
  },
  {
    symbol: "ENTA",
    name: "Enanta Pharmaceuticals, Inc.",
  },
  {
    symbol: "PCB",
    name: "PCB Bancorp",
  },
  {
    symbol: "OCGN",
    name: "Ocugen, Inc.",
  },
  {
    symbol: "NVX",
    name: "NOVONIX Limited",
  },
  {
    symbol: "ACCD",
    name: "Accolade, Inc.",
  },
  {
    symbol: "NKTX",
    name: "Nkarta, Inc.",
  },
  {
    symbol: "EGHT",
    name: "8x8, Inc.",
  },
  {
    symbol: "TLS",
    name: "Telos Corporation",
  },
  {
    symbol: "PMTS",
    name: "CPI Card Group Inc.",
  },
  {
    symbol: "PCYO",
    name: "Pure Cycle Corporation",
  },
  {
    symbol: "TSVT",
    name: "2seventy bio, Inc.",
  },
  {
    symbol: "ICG",
    name: "Intchains Group Limited",
  },
  {
    symbol: "ASUR",
    name: "Asure Software, Inc.",
  },
  {
    symbol: "RIGL",
    name: "Rigel Pharmaceuticals, Inc.",
  },
  {
    symbol: "SVII",
    name: "Spring Valley Acquisition Corp. II",
  },
  {
    symbol: "PKBK",
    name: "Parke Bancorp, Inc.",
  },
  {
    symbol: "QRTEB",
    name: "Qurate Retail, Inc.",
  },
  {
    symbol: "APEI",
    name: "American Public Education, Inc.",
  },
  {
    symbol: "RENE",
    name: "Cartesian Growth Corporation II",
  },
  {
    symbol: "ACRV",
    name: "Acrivon Therapeutics, Inc.",
  },
  {
    symbol: "PLBC",
    name: "Plumas Bancorp",
  },
  {
    symbol: "NKTR",
    name: "Nektar Therapeutics",
  },
  {
    symbol: "SGC",
    name: "Superior Group of Companies, Inc.",
  },
  {
    symbol: "SBT",
    name: "Sterling Bancorp, Inc. (Southfield, MI)",
  },
  {
    symbol: "ARTV",
    name: "Artiva Biotherapeutics, Inc.",
  },
  {
    symbol: "HLXB",
    name: "Helix Acquisition Corp. II",
  },
  {
    symbol: "MRSN",
    name: "Mersana Therapeutics, Inc.",
  },
  {
    symbol: "OMER",
    name: "Omeros Corporation",
  },
  {
    symbol: "ATYR",
    name: "aTyr Pharma, Inc.",
  },
  {
    symbol: "API",
    name: "Agora, Inc.",
  },
  {
    symbol: "INSG",
    name: "Inseego Corp.",
  },
  {
    symbol: "ARQ",
    name: "Arq, Inc.",
  },
  {
    symbol: "CMPX",
    name: "Compass Therapeutics, Inc.",
  },
  {
    symbol: "INSE",
    name: "Inspired Entertainment, Inc.",
  },
  {
    symbol: "NEGG",
    name: "Newegg Commerce, Inc.",
  },
  {
    symbol: "SCWO",
    name: "374Water Inc.",
  },
  {
    symbol: "LNKB",
    name: "LINKBANCORP, Inc.",
  },
  {
    symbol: "LUNG",
    name: "Pulmonx Corporation",
  },
  {
    symbol: "TSBK",
    name: "Timberland Bancorp, Inc.",
  },
  {
    symbol: "FVCB",
    name: "FVCBankcorp, Inc.",
  },
  {
    symbol: "BDSX",
    name: "Biodesix, Inc.",
  },
  {
    symbol: "AMRN",
    name: "Amarin Corporation plc",
  },
  {
    symbol: "NATR",
    name: "Nature's Sunshine Products, Inc.",
  },
  {
    symbol: "PSTX",
    name: "Poseida Therapeutics, Inc.",
  },
  {
    symbol: "SERA",
    name: "Sera Prognostics, Inc.",
  },
  {
    symbol: "PBPB",
    name: "Potbelly Corporation",
  },
  {
    symbol: "TROO",
    name: "TROOPS, Inc.",
  },
  {
    symbol: "MVIS",
    name: "MicroVision, Inc.",
  },
  {
    symbol: "IVA",
    name: "Inventiva S.A.",
  },
  {
    symbol: "BPRN",
    name: "Princeton Bancorp, Inc.",
  },
  {
    symbol: "RGTI",
    name: "Rigetti Computing, Inc.",
  },
  {
    symbol: "OKUR",
    name: "OnKure Therapeutics, Inc.",
  },
  {
    symbol: "PESI",
    name: "Perma-Fix Environmental Services, Inc.",
  },
  {
    symbol: "NBTX",
    name: "Nanobiotix S.A.",
  },
  {
    symbol: "PAL",
    name: "Proficient Auto Logistics, Inc.",
  },
  {
    symbol: "VIRC",
    name: "Virco Mfg. Corporation",
  },
  {
    symbol: "BETR",
    name: "Better Home & Finance Holding Company",
  },
  {
    symbol: "SNFCA",
    name: "Security National Financial Corporation",
  },
  {
    symbol: "MGNX",
    name: "MacroGenics, Inc.",
  },
  {
    symbol: "TRVI",
    name: "Trevi Therapeutics, Inc.",
  },
  {
    symbol: "QRTEA",
    name: "Qurate Retail, Inc.",
  },
  {
    symbol: "NWFL",
    name: "Norwood Financial Corp.",
  },
  {
    symbol: "OBIO",
    name: "Orchestra BioMed Holdings, Inc.",
  },
  {
    symbol: "OACC",
    name: "Oaktree Acquisition Corp. III Life Sciences",
  },
  {
    symbol: "SOPH",
    name: "SOPHiA GENETICS SA",
  },
  {
    symbol: "HITI",
    name: "High Tide Inc.",
  },
  {
    symbol: "UTMD",
    name: "Utah Medical Products, Inc.",
  },
  {
    symbol: "CHMG",
    name: "Chemung Financial Corporation",
  },
  {
    symbol: "MBCN",
    name: "Middlefield Banc Corp.",
  },
  {
    symbol: "PYXS",
    name: "Pyxis Oncology, Inc.",
  },
  {
    symbol: "INBX",
    name: "Inhibrx Biosciences, Inc.",
  },
  {
    symbol: "OVLY",
    name: "Oak Valley Bancorp",
  },
  {
    symbol: "GASS",
    name: "StealthGas Inc.",
  },
  {
    symbol: "XBIT",
    name: "XBiotech Inc.",
  },
  {
    symbol: "SSP",
    name: "The E.W. Scripps Company",
  },
  {
    symbol: "ZNTL",
    name: "Zentalis Pharmaceuticals, Inc.",
  },
  {
    symbol: "CVRX",
    name: "CVRx, Inc.",
  },
  {
    symbol: "SLDP",
    name: "Solid Power, Inc.",
  },
  {
    symbol: "INGN",
    name: "Inogen, Inc.",
  },
  {
    symbol: "BWFG",
    name: "Bankwell Financial Group, Inc.",
  },
  {
    symbol: "BLNK",
    name: "Blink Charging Co.",
  },
  {
    symbol: "VABK",
    name: "Virginia National Bankshares Corporation",
  },
  {
    symbol: "PROK",
    name: "ProKidney Corp.",
  },
  {
    symbol: "IVCB",
    name: "Investcorp Europe Acquisition Corp I",
  },
  {
    symbol: "DSY",
    name: "Big Tree Cloud Holdings Limited",
  },
  {
    symbol: "MACI",
    name: "Melar Acquisition Corp. I",
  },
  {
    symbol: "SLDB",
    name: "Solid Biosciences Inc.",
  },
  {
    symbol: "CAMP",
    name: "Camp4 Therapeutics Corporation",
  },
  {
    symbol: "KYTX",
    name: "Kyverna Therapeutics, Inc.",
  },
  {
    symbol: "FSTR",
    name: "L.B. Foster Company",
  },
  {
    symbol: "OB",
    name: "Outbrain Inc.",
  },
  {
    symbol: "NKLA",
    name: "Nikola Corporation",
  },
  {
    symbol: "AILE",
    name: "iLearningEngines, Inc.",
  },
  {
    symbol: "PLL",
    name: "Piedmont Lithium Inc.",
  },
  {
    symbol: "TCX",
    name: "Tucows Inc.",
  },
  {
    symbol: "PROC",
    name: "Procaps Group S.A.",
  },
  {
    symbol: "CRNT",
    name: "Ceragon Networks Ltd.",
  },
  {
    symbol: "CDXS",
    name: "Codexis, Inc.",
  },
  {
    symbol: "FINW",
    name: "FinWise Bancorp",
  },
  {
    symbol: "SEVN",
    name: "Seven Hills Realty Trust",
  },
  {
    symbol: "LCNB",
    name: "LCNB Corp.",
  },
  {
    symbol: "ETON",
    name: "Eton Pharmaceuticals, Inc.",
  },
  {
    symbol: "MOLN",
    name: "Molecular Partners AG",
  },
  {
    symbol: "RGCO",
    name: "RGC Resources, Inc.",
  },
  {
    symbol: "SKIN",
    name: "The Beauty Health Company",
  },
  {
    symbol: "VSTA",
    name: "Vasta Platform Limited",
  },
  {
    symbol: "TUSK",
    name: "Mammoth Energy Services, Inc.",
  },
  {
    symbol: "SCPH",
    name: "scPharmaceuticals Inc.",
  },
  {
    symbol: "BLFY",
    name: "Blue Foundry Bancorp",
  },
  {
    symbol: "KVAC",
    name: "Keen Vision Acquisition Corporation",
  },
  {
    symbol: "CDZI",
    name: "Cadiz Inc.",
  },
  {
    symbol: "FFNW",
    name: "First Financial Northwest, Inc.",
  },
  {
    symbol: "DRUG",
    name: "Bright Minds Biosciences Inc.",
  },
  {
    symbol: "AFCG",
    name: "AFC Gamma, Inc.",
  },
  {
    symbol: "SWKH",
    name: "SWK Holdings Corporation",
  },
  {
    symbol: "GLXG",
    name: "Galaxy Payroll Group Limited",
  },
  {
    symbol: "RCAT",
    name: "Red Cat Holdings, Inc.",
  },
  {
    symbol: "OPBK",
    name: "OP Bancorp",
  },
  {
    symbol: "HPAI",
    name: "Helport AI Limited",
  },
  {
    symbol: "MODV",
    name: "ModivCare Inc.",
  },
  {
    symbol: "ORGN",
    name: "Origin Materials, Inc.",
  },
  {
    symbol: "GOSS",
    name: "Gossamer Bio, Inc.",
  },
  {
    symbol: "ISTR",
    name: "Investar Holding Corporation",
  },
  {
    symbol: "GHIX",
    name: "Gores Holdings IX, Inc.",
  },
  {
    symbol: "CPSS",
    name: "Consumer Portfolio Services, Inc.",
  },
  {
    symbol: "FULC",
    name: "Fulcrum Therapeutics, Inc.",
  },
  {
    symbol: "SHIP",
    name: "Seanergy Maritime Holdings Corp.",
  },
  {
    symbol: "BCBP",
    name: "BCB Bancorp, Inc.",
  },
  {
    symbol: "FUNC",
    name: "First United Corporation",
  },
  {
    symbol: "GPRO",
    name: "GoPro, Inc.",
  },
  {
    symbol: "MFIN",
    name: "Medallion Financial Corp.",
  },
  {
    symbol: "EML",
    name: "The Eastern Company",
  },
  {
    symbol: "TIL",
    name: "Instil Bio, Inc.",
  },
  {
    symbol: "RCKY",
    name: "Rocky Brands, Inc.",
  },
  {
    symbol: "CRBP",
    name: "Corbus Pharmaceuticals Holdings, Inc.",
  },
  {
    symbol: "TATT",
    name: "TAT Technologies Ltd.",
  },
  {
    symbol: "BOOM",
    name: "DMC Global Inc.",
  },
  {
    symbol: "CFFI",
    name: "C&F Financial Corporation",
  },
  {
    symbol: "NNBR",
    name: "NN, Inc.",
  },
  {
    symbol: "RELL",
    name: "Richardson Electronics, Ltd.",
  },
  {
    symbol: "LFCR",
    name: "Lifecore Biomedical, Inc.",
  },
  {
    symbol: "MYFW",
    name: "First Western Financial, Inc.",
  },
  {
    symbol: "PAYS",
    name: "Paysign, Inc.",
  },
  {
    symbol: "ALCO",
    name: "Alico, Inc.",
  },
  {
    symbol: "KLTR",
    name: "Kaltura, Inc.",
  },
  {
    symbol: "OGI",
    name: "Organigram Holdings Inc.",
  },
  {
    symbol: "BNTC",
    name: "Benitec Biopharma Inc.",
  },
  {
    symbol: "CHSN",
    name: "Chanson International Holding",
  },
  {
    symbol: "PWOD",
    name: "Penns Woods Bancorp, Inc.",
  },
  {
    symbol: "SMLR",
    name: "Semler Scientific, Inc.",
  },
  {
    symbol: "HQI",
    name: "HireQuest, Inc.",
  },
  {
    symbol: "BZUN",
    name: "Baozun Inc.",
  },
  {
    symbol: "ADAP",
    name: "Adaptimmune Therapeutics plc",
  },
  {
    symbol: "SANG",
    name: "Sangoma Technologies Corporation",
  },
  {
    symbol: "ATAI",
    name: "Atai Life Sciences N.V.",
  },
  {
    symbol: "HURA",
    name: "TuHURA Biosciences, Inc.",
  },
  {
    symbol: "NKSH",
    name: "National Bankshares, Inc.",
  },
  {
    symbol: "EM",
    name: "Smart Share Global Limited",
  },
  {
    symbol: "CLLS",
    name: "Cellectis S.A.",
  },
  {
    symbol: "IVCA",
    name: "Investcorp India Acquisition Corp",
  },
  {
    symbol: "BSII",
    name: "Black Spade Acquisition II Co",
  },
  {
    symbol: "CDLX",
    name: "Cardlytics, Inc.",
  },
  {
    symbol: "CABA",
    name: "Cabaletta Bio, Inc.",
  },
  {
    symbol: "TSAT",
    name: "Telesat Corporation",
  },
  {
    symbol: "SFHG",
    name: "Samfine Creation Holdings Group Limited",
  },
  {
    symbol: "BAER",
    name: "Bridger Aerospace Group Holdings, Inc.",
  },
  {
    symbol: "PROP",
    name: "Prairie Operating Co.",
  },
  {
    symbol: "BROG",
    name: "Brooge Energy Limited",
  },
  {
    symbol: "TBRG",
    name: "TruBridge, Inc.",
  },
  {
    symbol: "NIU",
    name: "Niu Technologies",
  },
  {
    symbol: "WNEB",
    name: "Western New England Bancorp, Inc.",
  },
  {
    symbol: "HFFG",
    name: "HF Foods Group Inc.",
  },
  {
    symbol: "OXSQ",
    name: "Oxford Square Capital Corp.",
  },
  {
    symbol: "DMAC",
    name: "DiaMedica Therapeutics Inc.",
  },
  {
    symbol: "TZOO",
    name: "Travelzoo",
  },
  {
    symbol: "ESCA",
    name: "Escalade, Incorporated",
  },
  {
    symbol: "ESSA",
    name: "ESSA Bancorp, Inc.",
  },
  {
    symbol: "DSP",
    name: "Viant Technology Inc.",
  },
  {
    symbol: "STRS",
    name: "Stratus Properties Inc.",
  },
  {
    symbol: "LFMD",
    name: "LifeMD, Inc.",
  },
  {
    symbol: "TDTH",
    name: "Trident Digital Tech Holdings Ltd",
  },
  {
    symbol: "MDWD",
    name: "MediWound Ltd.",
  },
  {
    symbol: "KOD",
    name: "Kodiak Sciences Inc.",
  },
  {
    symbol: "PVBC",
    name: "Provident Bancorp, Inc.",
  },
  {
    symbol: "RILY",
    name: "B. Riley Financial, Inc.",
  },
  {
    symbol: "GLSI",
    name: "Greenwich LifeSciences, Inc.",
  },
  {
    symbol: "HWBK",
    name: "Hawthorn Bancshares, Inc.",
  },
  {
    symbol: "FCEL",
    name: "FuelCell Energy, Inc.",
  },
  {
    symbol: "PROF",
    name: "Profound Medical Corp.",
  },
  {
    symbol: "ATOS",
    name: "Atossa Therapeutics, Inc.",
  },
  {
    symbol: "CADL",
    name: "Candel Therapeutics, Inc.",
  },
  {
    symbol: "VXRT",
    name: "Vaxart, Inc.",
  },
  {
    symbol: "BVFL",
    name: "BV Financial, Inc.",
  },
  {
    symbol: "NPCE",
    name: "NeuroPace, Inc.",
  },
  {
    symbol: "RMBL",
    name: "RumbleOn, Inc.",
  },
  {
    symbol: "CNTX",
    name: "Context Therapeutics Inc.",
  },
  {
    symbol: "AMLI",
    name: "American Lithium Corp.",
  },
  {
    symbol: "SGMT",
    name: "Sagimet Biosciences Inc.",
  },
  {
    symbol: "ARAY",
    name: "Accuray Incorporated",
  },
  {
    symbol: "SKGR",
    name: "SK Growth Opportunities Corporation",
  },
  {
    symbol: "ESOA",
    name: "Energy Services of America Corporation",
  },
  {
    symbol: "HCVI",
    name: "Hennessy Capital Investment Corp. VI",
  },
  {
    symbol: "FCCO",
    name: "First Community Corporation",
  },
  {
    symbol: "MYPS",
    name: "PLAYSTUDIOS, Inc.",
  },
  {
    symbol: "FLL",
    name: "Full House Resorts, Inc.",
  },
  {
    symbol: "GAUZ",
    name: "Gauzy Ltd.",
  },
  {
    symbol: "SPKL",
    name: "Spark I Acquisition Corporation",
  },
  {
    symbol: "BRKH",
    name: "BurTech Acquisition Corp.",
  },
  {
    symbol: "BDTX",
    name: "Black Diamond Therapeutics, Inc.",
  },
  {
    symbol: "STHO",
    name: "Star Holdings",
  },
  {
    symbol: "MRCC",
    name: "Monroe Capital Corporation",
  },
  {
    symbol: "GNSS",
    name: "Genasys Inc.",
  },
  {
    symbol: "SVCO",
    name: "Silvaco Group, Inc.",
  },
  {
    symbol: "SMID",
    name: "Smith-Midland Corporation",
  },
  {
    symbol: "VOXX",
    name: "VOXX International Corporation",
  },
  {
    symbol: "PTMN",
    name: "Portman Ridge Finance Corporation",
  },
  {
    symbol: "LOGC",
    name: "ContextLogic Inc.",
  },
  {
    symbol: "JYNT",
    name: "The Joint Corp.",
  },
  {
    symbol: "WCT",
    name: "Wellchange Holdings Company Limited",
  },
  {
    symbol: "AENT",
    name: "Alliance Entertainment Holding Corporation",
  },
  {
    symbol: "ADVM",
    name: "Adverum Biotechnologies, Inc.",
  },
  {
    symbol: "FSFG",
    name: "First Savings Financial Group, Inc.",
  },
  {
    symbol: "EUDA",
    name: "EUDA Health Holdings Limited",
  },
  {
    symbol: "QRHC",
    name: "Quest Resource Holding Corporation",
  },
  {
    symbol: "MHLD",
    name: "Maiden Holdings, Ltd.",
  },
  {
    symbol: "MCAA",
    name: "Mountain & Co. I Acquisition Corp.",
  },
  {
    symbol: "HOFT",
    name: "Hooker Furnishings Corporation",
  },
  {
    symbol: "RDCM",
    name: "RADCOM Ltd.",
  },
  {
    symbol: "ACTU",
    name: "Actuate Therapeutics, Inc.",
  },
  {
    symbol: "BWAY",
    name: "BrainsWay Ltd.",
  },
  {
    symbol: "DIBS",
    name: "1stdibs.Com, Inc.",
  },
  {
    symbol: "NWTN",
    name: "NWTN Inc.",
  },
  {
    symbol: "ABOS",
    name: "Acumen Pharmaceuticals, Inc.",
  },
  {
    symbol: "CRBU",
    name: "Caribou Biosciences, Inc.",
  },
  {
    symbol: "SAMG",
    name: "Silvercrest Asset Management Group Inc.",
  },
  {
    symbol: "ALCY",
    name: "Alchemy Investments Acquisition Corp 1",
  },
  {
    symbol: "TWIN",
    name: "Twin Disc, Incorporated",
  },
  {
    symbol: "NVCT",
    name: "Nuvectis Pharma, Inc.",
  },
  {
    symbol: "CFBK",
    name: "CF Bankshares Inc.",
  },
  {
    symbol: "LFVN",
    name: "LifeVantage Corporation",
  },
  {
    symbol: "TPIC",
    name: "TPI Composites, Inc.",
  },
  {
    symbol: "ACHV",
    name: "Achieve Life Sciences, Inc.",
  },
  {
    symbol: "RCMT",
    name: "RCM Technologies, Inc.",
  },
  {
    symbol: "RTC",
    name: "Baijiayun Group Ltd",
  },
  {
    symbol: "ATLO",
    name: "Ames National Corporation",
  },
  {
    symbol: "STRT",
    name: "Strattec Security Corporation",
  },
  {
    symbol: "WILC",
    name: "G. Willi-Food International Ltd.",
  },
  {
    symbol: "QMMM",
    name: "QMMM Holdings Limited",
  },
  {
    symbol: "GALT",
    name: "Galectin Therapeutics Inc.",
  },
  {
    symbol: "IBAC",
    name: "IB Acquisition Corp.",
  },
  {
    symbol: "VOXR",
    name: "Vox Royalty Corp.",
  },
  {
    symbol: "CTRN",
    name: "Citi Trends, Inc.",
  },
  {
    symbol: "MAMO",
    name: "Massimo Group",
  },
  {
    symbol: "RMNI",
    name: "Rimini Street, Inc.",
  },
  {
    symbol: "CLAR",
    name: "Clarus Corporation",
  },
  {
    symbol: "DXLG",
    name: "Destination XL Group, Inc.",
  },
  {
    symbol: "ESHA",
    name: "ESH Acquisition Corp.",
  },
  {
    symbol: "FLD",
    name: "FTAC Emerald Acquisition Corp.",
  },
  {
    symbol: "REE",
    name: "REE Automotive Ltd.",
  },
  {
    symbol: "BFIN",
    name: "BankFinancial Corporation",
  },
  {
    symbol: "MMLP",
    name: "Martin Midstream Partners L.P.",
  },
  {
    symbol: "BTMD",
    name: "biote Corp.",
  },
  {
    symbol: "CXDO",
    name: "Crexendo, Inc.",
  },
  {
    symbol: "DRTS",
    name: "Alpha Tau Medical Ltd.",
  },
  {
    symbol: "CKPT",
    name: "Checkpoint Therapeutics, Inc.",
  },
  {
    symbol: "ORIS",
    name: "Oriental Rise Holdings Limited",
  },
  {
    symbol: "VTYX",
    name: "Ventyx Biosciences, Inc.",
  },
  {
    symbol: "LAKE",
    name: "Lakeland Industries, Inc.",
  },
  {
    symbol: "CGEN",
    name: "Compugen Ltd.",
  },
  {
    symbol: "LTRX",
    name: "Lantronix, Inc.",
  },
  {
    symbol: "UBFO",
    name: "United Security Bancshares",
  },
  {
    symbol: "CSTE",
    name: "Caesarstone Ltd.",
  },
  {
    symbol: "RFAI",
    name: "RF Acquisition Corp II",
  },
  {
    symbol: "ARBE",
    name: "Arbe Robotics Ltd.",
  },
  {
    symbol: "COYA",
    name: "Coya Therapeutics, Inc.",
  },
  {
    symbol: "III",
    name: "Information Services Group, Inc.",
  },
  {
    symbol: "YIBO",
    name: "Planet Image International Limited",
  },
  {
    symbol: "EXFY",
    name: "Expensify, Inc.",
  },
  {
    symbol: "IPHA",
    name: "Innate Pharma S.A.",
  },
  {
    symbol: "BCSA",
    name: "Blockchain Coinvestors Acquisition Corp. I",
  },
  {
    symbol: "CBFV",
    name: "CB Financial Services, Inc.",
  },
  {
    symbol: "TAYD",
    name: "Taylor Devices, Inc.",
  },
  {
    symbol: "FTLF",
    name: "FitLife Brands, Inc.",
  },
  {
    symbol: "AHG",
    name: "Akso Health Group",
  },
  {
    symbol: "SKYE",
    name: "Skye Bioscience, Inc.",
  },
  {
    symbol: "SSTI",
    name: "SoundThinking, Inc.",
  },
  {
    symbol: "ATGL",
    name: "Alpha Technology Group Limited",
  },
  {
    symbol: "INO",
    name: "Inovio Pharmaceuticals, Inc.",
  },
  {
    symbol: "ELDN",
    name: "Eledon Pharmaceuticals, Inc.",
  },
  {
    symbol: "VRA",
    name: "Vera Bradley, Inc.",
  },
  {
    symbol: "CRDL",
    name: "Cardiol Therapeutics Inc.",
  },
  {
    symbol: "CSLR",
    name: "Complete Solaria, Inc.",
  },
  {
    symbol: "VEEA",
    name: "Veea Inc.",
  },
  {
    symbol: "CZWI",
    name: "Citizens Community Bancorp, Inc.",
  },
  {
    symbol: "EHTH",
    name: "eHealth, Inc.",
  },
  {
    symbol: "GBIO",
    name: "Generation Bio Co.",
  },
  {
    symbol: "TNYA",
    name: "Tenaya Therapeutics, Inc.",
  },
  {
    symbol: "ISRL",
    name: "Israel Acquisitions Corp",
  },
  {
    symbol: "BANX",
    name: "ArrowMark Financial Corp.",
  },
  {
    symbol: "QSG",
    name: "QuantaSing Group Limited",
  },
  {
    symbol: "RPTX",
    name: "Repare Therapeutics Inc.",
  },
  {
    symbol: "MRBK",
    name: "Meridian Corporation",
  },
  {
    symbol: "ULBI",
    name: "Ultralife Corporation",
  },
  {
    symbol: "AMTX",
    name: "Aemetis, Inc.",
  },
  {
    symbol: "GEOS",
    name: "Geospace Technologies Corporation",
  },
  {
    symbol: "YXT",
    name: "YXT.COM Group Holding Limited",
  },
  {
    symbol: "AKYA",
    name: "Akoya Biosciences, Inc.",
  },
  {
    symbol: "HPH",
    name: "Highest Performances Holdings Inc.",
  },
  {
    symbol: "CURI",
    name: "CuriosityStream Inc.",
  },
  {
    symbol: "VIGL",
    name: "Vigil Neuroscience, Inc.",
  },
  {
    symbol: "PLCE",
    name: "The Children's Place, Inc.",
  },
  {
    symbol: "GGR",
    name: "Gogoro Inc.",
  },
  {
    symbol: "SFBC",
    name: "Sound Financial Bancorp, Inc.",
  },
  {
    symbol: "ECBK",
    name: "ECB Bancorp, Inc.",
  },
  {
    symbol: "EGAN",
    name: "eGain Corporation",
  },
  {
    symbol: "PBYI",
    name: "Puma Biotechnology, Inc.",
  },
  {
    symbol: "AFBI",
    name: "Affinity Bancshares, Inc.",
  },
  {
    symbol: "HNVR",
    name: "Hanover Bancorp, Inc.",
  },
  {
    symbol: "GAIA",
    name: "Gaia, Inc.",
  },
  {
    symbol: "TOUR",
    name: "Tuniu Corporation",
  },
  {
    symbol: "DLTH",
    name: "Duluth Holdings Inc.",
  },
  {
    symbol: "SBFG",
    name: "SB Financial Group, Inc.",
  },
  {
    symbol: "MNSB",
    name: "MainStreet Bancshares, Inc.",
  },
  {
    symbol: "FNWD",
    name: "Finward Bancorp",
  },
  {
    symbol: "PRCH",
    name: "Porch Group, Inc.",
  },
  {
    symbol: "ALLT",
    name: "Allot Ltd.",
  },
  {
    symbol: "HOWL",
    name: "Werewolf Therapeutics, Inc.",
  },
  {
    symbol: "PEBK",
    name: "Peoples Bancorp of North Carolina, Inc.",
  },
  {
    symbol: "RMBI",
    name: "Richmond Mutual Bancorporation, Inc.",
  },
  {
    symbol: "VSTM",
    name: "Verastem, Inc.",
  },
  {
    symbol: "LILM",
    name: "Lilium N.V.",
  },
  {
    symbol: "FRAF",
    name: "Franklin Financial Services Corporation",
  },
  {
    symbol: "FXNC",
    name: "First National Corporation",
  },
  {
    symbol: "QH",
    name: "Quhuo Limited",
  },
  {
    symbol: "EPSN",
    name: "Epsilon Energy Ltd.",
  },
  {
    symbol: "ALTO",
    name: "Alto Ingredients, Inc.",
  },
  {
    symbol: "XNET",
    name: "Xunlei Limited",
  },
  {
    symbol: "UNB",
    name: "Union Bankshares, Inc.",
  },
  {
    symbol: "MRAM",
    name: "Everspin Technologies, Inc.",
  },
  {
    symbol: "NOVV",
    name: "Nova Vision Acquisition Corporation",
  },
  {
    symbol: "EBMT",
    name: "Eagle Bancorp Montana, Inc.",
  },
  {
    symbol: "AZ",
    name: "A2Z Cust2Mate Solutions Corp.",
  },
  {
    symbol: "HURC",
    name: "Hurco Companies, Inc.",
  },
  {
    symbol: "VERI",
    name: "Veritone, Inc.",
  },
  {
    symbol: "POWW",
    name: "AMMO, Inc.",
  },
  {
    symbol: "GATE",
    name: "Marblegate Acquisition Corp.",
  },
  {
    symbol: "CEP",
    name: "Cantor Equity Partners, Inc.",
  },
  {
    symbol: "FGBI",
    name: "First Guaranty Bancshares, Inc.",
  },
  {
    symbol: "ADAG",
    name: "Adagene Inc.",
  },
  {
    symbol: "AVTX",
    name: "Avalo Therapeutics, Inc.",
  },
  {
    symbol: "CRDF",
    name: "Cardiff Oncology, Inc.",
  },
  {
    symbol: "ATLX",
    name: "Atlas Lithium Corporation",
  },
  {
    symbol: "CSPI",
    name: "CSP Inc.",
  },
  {
    symbol: "OTLK",
    name: "Outlook Therapeutics, Inc.",
  },
  {
    symbol: "CAAS",
    name: "China Automotive Systems, Inc.",
  },
  {
    symbol: "LCUT",
    name: "Lifetime Brands, Inc.",
  },
  {
    symbol: "ISSC",
    name: "Innovative Solutions and Support, Inc.",
  },
  {
    symbol: "LPTX",
    name: "Leap Therapeutics, Inc.",
  },
  {
    symbol: "FENC",
    name: "Fennec Pharmaceuticals Inc.",
  },
  {
    symbol: "USGO",
    name: "U.S. GoldMining Inc.",
  },
  {
    symbol: "ALAR",
    name: "Alarum Technologies Ltd.",
  },
  {
    symbol: "ME",
    name: "23andMe Holding Co.",
  },
  {
    symbol: "INVZ",
    name: "Innoviz Technologies Ltd.",
  },
  {
    symbol: "TELO",
    name: "Telomir Pharmaceuticals, Inc.",
  },
  {
    symbol: "NUTX",
    name: "Nutex Health Inc.",
  },
  {
    symbol: "IMUX",
    name: "Immunic, Inc.",
  },
  {
    symbol: "BSET",
    name: "Bassett Furniture Industries, Incorporated",
  },
  {
    symbol: "IPSC",
    name: "Century Therapeutics, Inc.",
  },
  {
    symbol: "VERU",
    name: "Veru Inc.",
  },
  {
    symbol: "GRWG",
    name: "GrowGeneration Corp.",
  },
  {
    symbol: "AOUT",
    name: "American Outdoor Brands, Inc.",
  },
  {
    symbol: "SKYX",
    name: "SKYX Platforms Corp.",
  },
  {
    symbol: "BRLS",
    name: "Borealis Foods Inc.",
  },
  {
    symbol: "QUIK",
    name: "QuickLogic Corporation",
  },
  {
    symbol: "NEON",
    name: "Neonode Inc.",
  },
  {
    symbol: "SHMD",
    name: "SCHMID Group N.V.",
  },
  {
    symbol: "MCRB",
    name: "Seres Therapeutics, Inc.",
  },
  {
    symbol: "LGO",
    name: "Largo Inc.",
  },
  {
    symbol: "KNDI",
    name: "Kandi Technologies Group, Inc.",
  },
  {
    symbol: "TLSI",
    name: "TriSalus Life Sciences, Inc.",
  },
  {
    symbol: "GUTS",
    name: "Fractyl Health, Inc.",
  },
  {
    symbol: "BRAG",
    name: "Bragg Gaming Group Inc.",
  },
  {
    symbol: "PLAO",
    name: "Patria Latin American Opportunity Acquisition Corp.",
  },
  {
    symbol: "OPTN",
    name: "OptiNose, Inc.",
  },
  {
    symbol: "FEIM",
    name: "Frequency Electronics, Inc.",
  },
  {
    symbol: "IVVD",
    name: "Invivyd, Inc.",
  },
  {
    symbol: "SCLX",
    name: "Scilex Holding Company",
  },
  {
    symbol: "KOPN",
    name: "Kopin Corporation",
  },
  {
    symbol: "ACET",
    name: "Adicet Bio, Inc.",
  },
  {
    symbol: "KGEI",
    name: "Kolibri Global Energy Inc.",
  },
  {
    symbol: "APXI",
    name: "APx Acquisition Corp. I",
  },
  {
    symbol: "DLHC",
    name: "DLH Holdings Corp.",
  },
  {
    symbol: "MNTX",
    name: "Manitex International, Inc.",
  },
  {
    symbol: "CRNC",
    name: "Cerence Inc.",
  },
  {
    symbol: "NTIC",
    name: "Northern Technologies International Corporation",
  },
  {
    symbol: "KRMD",
    name: "KORU Medical Systems, Inc.",
  },
  {
    symbol: "TOYO",
    name: "TOYO Co., Ltd.",
  },
  {
    symbol: "INMB",
    name: "INmune Bio, Inc.",
  },
  {
    symbol: "QIPT",
    name: "Quipt Home Medical Corp.",
  },
  {
    symbol: "MNPR",
    name: "Monopar Therapeutics Inc.",
  },
  {
    symbol: "DTI",
    name: "Drilling Tools International Corporation",
  },
  {
    symbol: "MASS",
    name: "908 Devices Inc.",
  },
  {
    symbol: "SNCR",
    name: "Synchronoss Technologies, Inc.",
  },
  {
    symbol: "SFWL",
    name: "Shengfeng Development Limited",
  },
  {
    symbol: "PDSB",
    name: "PDS Biotechnology Corporation",
  },
  {
    symbol: "VBFC",
    name: "Village Bank and Trust Financial Corp.",
  },
  {
    symbol: "CFFS",
    name: "CF Acquisition Corp. VII",
  },
  {
    symbol: "KINS",
    name: "Kingstone Companies, Inc.",
  },
  {
    symbol: "TRVG",
    name: "trivago N.V.",
  },
  {
    symbol: "FCAP",
    name: "First Capital, Inc.",
  },
  {
    symbol: "SEER",
    name: "Seer, Inc.",
  },
  {
    symbol: "OVBC",
    name: "Ohio Valley Banc Corp.",
  },
  {
    symbol: "CBRG",
    name: "Chain Bridge I",
  },
  {
    symbol: "AXTI",
    name: "AXT, Inc.",
  },
  {
    symbol: "GOCO",
    name: "GoHealth, Inc.",
  },
  {
    symbol: "PLMJ",
    name: "Plum Acquisition Corp. III",
  },
  {
    symbol: "LARK",
    name: "Landmark Bancorp, Inc.",
  },
  {
    symbol: "DERM",
    name: "Journey Medical Corporation",
  },
  {
    symbol: "SUUN",
    name: "SolarBank Corporation",
  },
  {
    symbol: "TLSA",
    name: "Tiziana Life Sciences Ltd",
  },
  {
    symbol: "RMTI",
    name: "Rockwell Medical, Inc.",
  },
  {
    symbol: "OPAL",
    name: "OPAL Fuels Inc.",
  },
  {
    symbol: "IMPP",
    name: "Imperial Petroleum Inc.",
  },
  {
    symbol: "FBYD",
    name: "Falcon's Beyond Global, Inc.",
  },
  {
    symbol: "PCSC",
    name: "Perceptive Capital Solutions Corp",
  },
  {
    symbol: "QSI",
    name: "Quantum-Si incorporated",
  },
  {
    symbol: "OFS",
    name: "OFS Capital Corporation",
  },
  {
    symbol: "ELUT",
    name: "Elutia Inc.",
  },
  {
    symbol: "TLGY",
    name: "TLGY Acquisition Corporation",
  },
  {
    symbol: "RLMD",
    name: "Relmada Therapeutics, Inc.",
  },
  {
    symbol: "ALOT",
    name: "AstroNova, Inc.",
  },
  {
    symbol: "THCH",
    name: "TH International Limited",
  },
  {
    symbol: "PBHC",
    name: "Pathfinder Bancorp, Inc.",
  },
  {
    symbol: "MPAA",
    name: "Motorcar Parts of America, Inc.",
  },
  {
    symbol: "ILLR",
    name: "Triller Group Inc.",
  },
  {
    symbol: "LPSN",
    name: "LivePerson, Inc.",
  },
  {
    symbol: "CURR",
    name: "CURRENC Group Inc.",
  },
  {
    symbol: "ASMB",
    name: "Assembly Biosciences, Inc.",
  },
  {
    symbol: "CSLM",
    name: "CSLM Acquisition Corp.",
  },
  {
    symbol: "STKS",
    name: "The ONE Group Hospitality, Inc.",
  },
  {
    symbol: "SY",
    name: "So-Young International Inc.",
  },
  {
    symbol: "PROV",
    name: "Provident Financial Holdings, Inc.",
  },
  {
    symbol: "CMTL",
    name: "Comtech Telecommunications Corp.",
  },
  {
    symbol: "PPYA",
    name: "Papaya Growth Opportunity Corp. I",
  },
  {
    symbol: "UEIC",
    name: "Universal Electronics Inc.",
  },
  {
    symbol: "ALLK",
    name: "Allakos Inc.",
  },
  {
    symbol: "SRTS",
    name: "Sensus Healthcare, Inc.",
  },
  {
    symbol: "WMPN",
    name: "William Penn Bancorporation",
  },
  {
    symbol: "GECC",
    name: "Great Elm Capital Corp.",
  },
  {
    symbol: "SOWG",
    name: "Sow Good Inc.",
  },
  {
    symbol: "SSSS",
    name: "SuRo Capital Corp.",
  },
  {
    symbol: "ZBAO",
    name: "Zhibao Technology Inc.",
  },
  {
    symbol: "LEE",
    name: "Lee Enterprises, Incorporated",
  },
  {
    symbol: "CRVO",
    name: "CervoMed Inc.",
  },
  {
    symbol: "SIEB",
    name: "Siebert Financial Corp.",
  },
  {
    symbol: "AIRG",
    name: "Airgain, Inc.",
  },
  {
    symbol: "FNGR",
    name: "FingerMotion, Inc.",
  },
  {
    symbol: "OPI",
    name: "Office Properties Income Trust",
  },
  {
    symbol: "BSBK",
    name: "Bogota Financial Corp.",
  },
  {
    symbol: "PPIH",
    name: "Perma-Pipe International Holdings, Inc.",
  },
  {
    symbol: "HBIO",
    name: "Harvard Bioscience, Inc.",
  },
  {
    symbol: "KPTI",
    name: "Karyopharm Therapeutics Inc.",
  },
  {
    symbol: "FBLG",
    name: "FibroBiologics, Inc.",
  },
  {
    symbol: "ANIX",
    name: "Anixa Biosciences, Inc.",
  },
  {
    symbol: "VFF",
    name: "Village Farms International, Inc.",
  },
  {
    symbol: "SUNS",
    name: "Sunrise Realty Trust, Inc.",
  },
  {
    symbol: "MOND",
    name: "Mondee Holdings, Inc.",
  },
  {
    symbol: "BCOV",
    name: "Brightcove Inc.",
  },
  {
    symbol: "DBVT",
    name: "DBV Technologies S.A.",
  },
  {
    symbol: "THCP",
    name: "Thunder Bridge Capital Partners IV Inc.",
  },
  {
    symbol: "QUBT",
    name: "Quantum Computing Inc.",
  },
  {
    symbol: "SIFY",
    name: "Sify Technologies Limited",
  },
  {
    symbol: "IMAB",
    name: "I-Mab",
  },
  {
    symbol: "OPOF",
    name: "Old Point Financial Corporation",
  },
  {
    symbol: "OPRX",
    name: "OptimizeRx Corporation",
  },
  {
    symbol: "TBMC",
    name: "Trailblazer Merger Corporation I",
  },
  {
    symbol: "BOWN",
    name: "Bowen Acquisition Corp",
  },
  {
    symbol: "FONR",
    name: "FONAR Corporation",
  },
  {
    symbol: "CHCI",
    name: "Comstock Holding Companies, Inc.",
  },
  {
    symbol: "VUZI",
    name: "Vuzix Corporation",
  },
  {
    symbol: "PFX",
    name: "PhenixFIN Corporation",
  },
  {
    symbol: "GNTA",
    name: "Genenta Science S.p.A.",
  },
  {
    symbol: "RVSB",
    name: "Riverview Bancorp, Inc.",
  },
  {
    symbol: "NEOV",
    name: "NeoVolta Inc.",
  },
  {
    symbol: "SRBK",
    name: "SR Bancorp, Inc.",
  },
  {
    symbol: "CVGI",
    name: "Commercial Vehicle Group, Inc.",
  },
  {
    symbol: "ACNT",
    name: "Ascent Industries Co.",
  },
  {
    symbol: "BLUE",
    name: "bluebird bio, Inc.",
  },
  {
    symbol: "PRPL",
    name: "Purple Innovation, Inc.",
  },
  {
    symbol: "REKR",
    name: "Rekor Systems, Inc.",
  },
  {
    symbol: "ORMP",
    name: "Oramed Pharmaceuticals Inc.",
  },
  {
    symbol: "PHUN",
    name: "Phunware, Inc.",
  },
  {
    symbol: "OPRT",
    name: "Oportun Financial Corporation",
  },
  {
    symbol: "RBKB",
    name: "Rhinebeck Bancorp, Inc.",
  },
  {
    symbol: "SPWH",
    name: "Sportsman's Warehouse Holdings, Inc.",
  },
  {
    symbol: "EVGR",
    name: "Evergreen Corporation",
  },
  {
    symbol: "CPHC",
    name: "Canterbury Park Holding Corporation",
  },
  {
    symbol: "AGEN",
    name: "Agenus Inc.",
  },
  {
    symbol: "MDXH",
    name: "MDxHealth SA",
  },
  {
    symbol: "WOK",
    name: "WORK Medical Technology Group LTD",
  },
  {
    symbol: "AFJK",
    name: "Aimei Health Technology Co., Ltd",
  },
  {
    symbol: "GLAC",
    name: "Global Lights Acquisition Corp",
  },
  {
    symbol: "PDEX",
    name: "Pro-Dex, Inc.",
  },
  {
    symbol: "MIST",
    name: "Milestone Pharmaceuticals Inc.",
  },
  {
    symbol: "ASRT",
    name: "Assertio Holdings, Inc.",
  },
  {
    symbol: "CBAT",
    name: "CBAK Energy Technology, Inc.",
  },
  {
    symbol: "KVHI",
    name: "KVH Industries, Inc.",
  },
  {
    symbol: "CBUS",
    name: "Cibus, Inc.",
  },
  {
    symbol: "IFRX",
    name: "InflaRx N.V.",
  },
  {
    symbol: "SPHL",
    name: "Springview Holdings Ltd",
  },
  {
    symbol: "CUE",
    name: "Cue Biopharma, Inc.",
  },
  {
    symbol: "PFTA",
    name: "Perception Capital Corp. III",
  },
  {
    symbol: "QETA",
    name: "Quetta Acquisition Corporation",
  },
  {
    symbol: "RGLS",
    name: "Regulus Therapeutics Inc.",
  },
  {
    symbol: "KEQU",
    name: "Kewaunee Scientific Corporation",
  },
  {
    symbol: "EDAP",
    name: "EDAP TMS S.A.",
  },
  {
    symbol: "ONCY",
    name: "Oncolytics Biotech Inc.",
  },
  {
    symbol: "WAI",
    name: "Top KingWin Ltd",
  },
  {
    symbol: "IVAC",
    name: "Intevac, Inc.",
  },
  {
    symbol: "RRGB",
    name: "Red Robin Gourmet Burgers, Inc.",
  },
  {
    symbol: "DYCQ",
    name: "DT Cloud Acquisition Corporation",
  },
  {
    symbol: "FNWB",
    name: "First Northwest Bancorp",
  },
  {
    symbol: "BCAB",
    name: "BioAtla, Inc.",
  },
  {
    symbol: "ATOM",
    name: "Atomera Incorporated",
  },
  {
    symbol: "CITE",
    name: "Cartica Acquisition Corp",
  },
  {
    symbol: "ACRS",
    name: "Aclaris Therapeutics, Inc.",
  },
  {
    symbol: "BKHA",
    name: "Black Hawk Acquisition Corporation",
  },
  {
    symbol: "CODA",
    name: "Coda Octopus Group, Inc.",
  },
  {
    symbol: "TMTC",
    name: "TMT Acquisition Corp",
  },
  {
    symbol: "CHRS",
    name: "Coherus BioSciences, Inc.",
  },
  {
    symbol: "ONYX",
    name: "Onyx Acquisition Co. I",
  },
  {
    symbol: "LGCL",
    name: "Lucas GC Limited",
  },
  {
    symbol: "ACAB",
    name: "Atlantic Coastal Acquisition Corp. II",
  },
  {
    symbol: "GIFI",
    name: "Gulf Island Fabrication, Inc.",
  },
  {
    symbol: "ARQQ",
    name: "Arqit Quantum Inc.",
  },
  {
    symbol: "IROH",
    name: "Iron Horse Acquisitions Corp.",
  },
  {
    symbol: "BZFD",
    name: "BuzzFeed, Inc.",
  },
  {
    symbol: "TBNK",
    name: "Territorial Bancorp Inc.",
  },
  {
    symbol: "SND",
    name: "Smart Sand, Inc.",
  },
  {
    symbol: "SATL",
    name: "Satellogic Inc.",
  },
  {
    symbol: "CNTY",
    name: "Century Casinos, Inc.",
  },
  {
    symbol: "ALVR",
    name: "AlloVir, Inc.",
  },
  {
    symbol: "FTCI",
    name: "FTC Solar, Inc.",
  },
  {
    symbol: "LASE",
    name: "Laser Photonics Corporation",
  },
  {
    symbol: "PWUP",
    name: "PowerUp Acquisition Corp.",
  },
  {
    symbol: "SGA",
    name: "Saga Communications, Inc.",
  },
  {
    symbol: "DTSQ",
    name: "DT Cloud Star Acquisition Corporation",
  },
  {
    symbol: "FSHP",
    name: "Flag Ship Acquisition Corporation",
  },
  {
    symbol: "GAQ",
    name: "Generation Asia I Acquisition Limited",
  },
  {
    symbol: "BYSI",
    name: "BeyondSpring Inc.",
  },
  {
    symbol: "FAT",
    name: "FAT Brands Inc.",
  },
  {
    symbol: "AZI",
    name: "Autozi Internet Technology (Global) Ltd.",
  },
  {
    symbol: "HSPO",
    name: "Horizon Space Acquisition I Corp.",
  },
  {
    symbol: "VIOT",
    name: "Viomi Technology Co., Ltd",
  },
  {
    symbol: "EPRX",
    name: "Eupraxia Pharmaceuticals Inc.",
  },
  {
    symbol: "CASI",
    name: "CASI Pharmaceuticals, Inc.",
  },
  {
    symbol: "BYNO",
    name: "byNordic Acquisition Corporation",
  },
  {
    symbol: "MAYS",
    name: "J.W. Mays, Inc.",
  },
  {
    symbol: "WRAP",
    name: "Wrap Technologies, Inc.",
  },
  {
    symbol: "GSIT",
    name: "GSI Technology, Inc.",
  },
  {
    symbol: "HLVX",
    name: "HilleVax, Inc.",
  },
  {
    symbol: "LTBR",
    name: "Lightbridge Corporation",
  },
  {
    symbol: "INVE",
    name: "Identiv, Inc.",
  },
  {
    symbol: "FATBB",
    name: "FAT Brands Inc.",
  },
  {
    symbol: "EMCG",
    name: "Embrace Change Acquisition Corp.",
  },
  {
    symbol: "GNLX",
    name: "Genelux Corporation",
  },
  {
    symbol: "CTOR",
    name: "Citius Oncology, Inc.",
  },
  {
    symbol: "OVID",
    name: "Ovid Therapeutics Inc.",
  },
  {
    symbol: "WIMI",
    name: "WiMi Hologram Cloud Inc.",
  },
  {
    symbol: "PMVP",
    name: "PMV Pharmaceuticals, Inc.",
  },
  {
    symbol: "SLNG",
    name: "Stabilis Solutions, Inc.",
  },
  {
    symbol: "PRLD",
    name: "Prelude Therapeutics Incorporated",
  },
  {
    symbol: "MNOV",
    name: "MediciNova, Inc.",
  },
  {
    symbol: "AIFU",
    name: "Fanhua Inc.",
  },
  {
    symbol: "VMCA",
    name: "Valuence Merger Corp. I",
  },
  {
    symbol: "NPAB",
    name: "New Providence Acquisition Corp. II",
  },
  {
    symbol: "CTMX",
    name: "CytomX Therapeutics, Inc.",
  },
  {
    symbol: "OAKU",
    name: "Oak Woods Acquisition Corporation",
  },
  {
    symbol: "LATG",
    name: "Chenghe Acquisition I Co.",
  },
  {
    symbol: "BLEU",
    name: "bleuacacia ltd",
  },
  {
    symbol: "DPCS",
    name: "DP Cap Acquisition Corp I",
  },
  {
    symbol: "YTRA",
    name: "Yatra Online, Inc.",
  },
  {
    symbol: "WW",
    name: "WW International, Inc.",
  },
  {
    symbol: "AITR",
    name: "AI Transportation Acquisition Corp",
  },
  {
    symbol: "GAN",
    name: "GAN Limited",
  },
  {
    symbol: "ASYS",
    name: "Amtech Systems, Inc.",
  },
  {
    symbol: "IKNA",
    name: "Ikena Oncology, Inc.",
  },
  {
    symbol: "CLSD",
    name: "Clearside Biomedical, Inc.",
  },
  {
    symbol: "BIRD",
    name: "Allbirds, Inc.",
  },
  {
    symbol: "VTGN",
    name: "Vistagen Therapeutics, Inc.",
  },
  {
    symbol: "MAPS",
    name: "WM Technology, Inc.",
  },
  {
    symbol: "GOEV",
    name: "Canoo Inc.",
  },
  {
    symbol: "BAYA",
    name: "Bayview Acquisition Corp",
  },
  {
    symbol: "XFOR",
    name: "X4 Pharmaceuticals, Inc.",
  },
  {
    symbol: "SILC",
    name: "Silicom Ltd.",
  },
  {
    symbol: "RSSS",
    name: "Research Solutions, Inc.",
  },
  {
    symbol: "AERT",
    name: "Aeries Technology, Inc",
  },
  {
    symbol: "ALRN",
    name: "Aileron Therapeutics, Inc.",
  },
  {
    symbol: "TGAA",
    name: "Target Global Acquisition I Corp.",
  },
  {
    symbol: "MGYR",
    name: "Magyar Bancorp, Inc.",
  },
  {
    symbol: "BRID",
    name: "Bridgford Foods Corporation",
  },
  {
    symbol: "ZTEK",
    name: "Zentek Ltd.",
  },
  {
    symbol: "IOBT",
    name: "IO Biotech, Inc.",
  },
  {
    symbol: "PRLH",
    name: "Pearl Holdings Acquisition Corp",
  },
  {
    symbol: "JVSA",
    name: "JVSPAC Acquisition Corp.",
  },
  {
    symbol: "OMGA",
    name: "Omega Therapeutics, Inc.",
  },
  {
    symbol: "RENB",
    name: "Renovaro Inc.",
  },
  {
    symbol: "HUHU",
    name: "HUHUTECH International Group Inc.",
  },
  {
    symbol: "PETS",
    name: "PetMed Express, Inc.",
  },
  {
    symbol: "FNVT",
    name: "Finnovate Acquisition Corp.",
  },
  {
    symbol: "LSBK",
    name: "Lake Shore Bancorp, Inc.",
  },
  {
    symbol: "PFIE",
    name: "Profire Energy, Inc.",
  },
  {
    symbol: "HNNA",
    name: "Hennessy Advisors, Inc.",
  },
  {
    symbol: "CDTX",
    name: "Cidara Therapeutics, Inc.",
  },
  {
    symbol: "ATMV",
    name: "AlphaVest Acquisition Corp",
  },
  {
    symbol: "SNYR",
    name: "Synergy CHC Corp.",
  },
  {
    symbol: "CMRX",
    name: "Chimerix, Inc.",
  },
  {
    symbol: "UBCP",
    name: "United Bancorp, Inc.",
  },
  {
    symbol: "CHAR",
    name: "Charlton Aria Acquisition Corporation",
  },
  {
    symbol: "ATMC",
    name: "AlphaTime Acquisition Corp",
  },
  {
    symbol: "ANL",
    name: "Adlai Nortye Ltd.",
  },
  {
    symbol: "CLEU",
    name: "China Liberal Education Holdings Limited",
  },
  {
    symbol: "ALXO",
    name: "ALX Oncology Holdings Inc.",
  },
  {
    symbol: "MFH",
    name: "Mercurity Fintech Holding Inc.",
  },
  {
    symbol: "INCR",
    name: "InterCure Ltd.",
  },
  {
    symbol: "SKK",
    name: "SKK Holdings Limited",
  },
  {
    symbol: "AREC",
    name: "American Resources Corporation",
  },
  {
    symbol: "MGRM",
    name: "Monogram Technologies Inc.",
  },
  {
    symbol: "FVN",
    name: "Future Vision II Acquisition Corp.",
  },
  {
    symbol: "IVCP",
    name: "Swiftmerge Acquisition Corp.",
  },
  {
    symbol: "NCTY",
    name: "The9 Limited",
  },
  {
    symbol: "BOCN",
    name: "Blue Ocean Acquisition Corp.",
  },
  {
    symbol: "CLRB",
    name: "Cellectar Biosciences, Inc.",
  },
  {
    symbol: "EURK",
    name: "Eureka Acquisition Corp",
  },
  {
    symbol: "TDUP",
    name: "ThredUp Inc.",
  },
  {
    symbol: "AUID",
    name: "authID Inc.",
  },
  {
    symbol: "WPRT",
    name: "Westport Fuel Systems Inc.",
  },
  {
    symbol: "INAQ",
    name: "Insight Acquisition Corp.",
  },
  {
    symbol: "GLE",
    name: "Global Engine Group Holding Limited",
  },
  {
    symbol: "MAXN",
    name: "Maxeon Solar Technologies, Ltd.",
  },
  {
    symbol: "MSSA",
    name: "Metal Sky Star Acquisition Corporation",
  },
  {
    symbol: "NB",
    name: "NioCorp Developments Ltd.",
  },
  {
    symbol: "ABAT",
    name: "American Battery Technology Company",
  },
  {
    symbol: "KLXE",
    name: "KLX Energy Services Holdings, Inc.",
  },
  {
    symbol: "AUBN",
    name: "Auburn National Bancorporation, Inc.",
  },
  {
    symbol: "MODD",
    name: "Modular Medical, Inc.",
  },
  {
    symbol: "FAAS",
    name: "DigiAsia Corp.",
  },
  {
    symbol: "MTC",
    name: "MMTec, Inc.",
  },
  {
    symbol: "TETE",
    name: "Technology & Telecommunication Acquisition Corporation",
  },
  {
    symbol: "LBGJ",
    name: "Li Bang International Corporation Inc.",
  },
  {
    symbol: "AEAE",
    name: "AltEnergy Acquisition Corp.",
  },
  {
    symbol: "HYPR",
    name: "Hyperfine, Inc.",
  },
  {
    symbol: "ARBK",
    name: "Argo Blockchain plc",
  },
  {
    symbol: "MCHX",
    name: "Marchex, Inc.",
  },
  {
    symbol: "ELVA",
    name: "Electrovaya Inc.",
  },
  {
    symbol: "TYGO",
    name: "Tigo Energy, Inc.",
  },
  {
    symbol: "MGX",
    name: "Metagenomi, Inc.",
  },
  {
    symbol: "FRLA",
    name: "Fortune Rise Acquisition Corporation",
  },
  {
    symbol: "PIII",
    name: "P3 Health Partners Inc.",
  },
  {
    symbol: "BEEM",
    name: "Beam Global",
  },
  {
    symbol: "VTSI",
    name: "VirTra, Inc.",
  },
  {
    symbol: "SOTK",
    name: "Sono-Tek Corporation",
  },
  {
    symbol: "SLS",
    name: "SELLAS Life Sciences Group, Inc.",
  },
  {
    symbol: "DIST",
    name: "Distoken Acquisition Corporation",
  },
  {
    symbol: "GRDI",
    name: "Griid Infrastructure Inc.",
  },
  {
    symbol: "RANI",
    name: "Rani Therapeutics Holdings, Inc.",
  },
  {
    symbol: "LOOP",
    name: "Loop Industries, Inc.",
  },
  {
    symbol: "NHTC",
    name: "Natural Health Trends Corp.",
  },
  {
    symbol: "ELTK",
    name: "Eltek Ltd.",
  },
  {
    symbol: "FIAC",
    name: "Focus Impact Acquisition Corp.",
  },
  {
    symbol: "ICCH",
    name: "ICC Holdings, Inc.",
  },
  {
    symbol: "REFR",
    name: "Research Frontiers Incorporated",
  },
  {
    symbol: "VANI",
    name: "Vivani Medical, Inc.",
  },
  {
    symbol: "NVAC",
    name: "NorthView Acquisition Corporation",
  },
  {
    symbol: "ONDS",
    name: "Ondas Holdings Inc.",
  },
  {
    symbol: "LICN",
    name: "Lichen China Limited",
  },
  {
    symbol: "PPSI",
    name: "Pioneer Power Solutions, Inc.",
  },
  {
    symbol: "IROQ",
    name: "IF Bancorp, Inc.",
  },
  {
    symbol: "GLLI",
    name: "Globalink Investment Inc.",
  },
  {
    symbol: "GANX",
    name: "Gain Therapeutics, Inc.",
  },
  {
    symbol: "SDIG",
    name: "Stronghold Digital Mining, Inc.",
  },
  {
    symbol: "LPTH",
    name: "LightPath Technologies, Inc.",
  },
  {
    symbol: "SPRO",
    name: "Spero Therapeutics, Inc.",
  },
  {
    symbol: "HAIA",
    name: "Healthcare AI Acquisition Corp.",
  },
  {
    symbol: "SHOT",
    name: "Safety Shot, Inc.",
  },
  {
    symbol: "MVST",
    name: "Microvast Holdings, Inc.",
  },
  {
    symbol: "OPXS",
    name: "Optex Systems Holdings, Inc",
  },
  {
    symbol: "KOSS",
    name: "Koss Corporation",
  },
  {
    symbol: "ZENV",
    name: "Zenvia Inc.",
  },
  {
    symbol: "CNTB",
    name: "Connect Biopharma Holdings Limited",
  },
  {
    symbol: "SELX",
    name: "Semilux International Ltd.",
  },
  {
    symbol: "FUSB",
    name: "First US Bancshares, Inc.",
  },
  {
    symbol: "USAU",
    name: "U.S. Gold Corp.",
  },
  {
    symbol: "ECOR",
    name: "electroCore, Inc.",
  },
  {
    symbol: "BOLD",
    name: "Boundless Bio, Inc.",
  },
  {
    symbol: "LVLU",
    name: "Lulu's Fashion Lounge Holdings, Inc.",
  },
  {
    symbol: "ENTX",
    name: "Entera Bio Ltd.",
  },
  {
    symbol: "YI",
    name: "111, Inc.",
  },
  {
    symbol: "TOP",
    name: "TOP Financial Group Limited",
  },
  {
    symbol: "AIMAU",
    name: "Aimfinity Investment Corp. I",
  },
  {
    symbol: "FTII",
    name: "FutureTech II Acquisition Corp.",
  },
  {
    symbol: "RFAC",
    name: "RF Acquisition Corp.",
  },
  {
    symbol: "LRFC",
    name: "Logan Ridge Finance Corporation",
  },
  {
    symbol: "OPTX",
    name: "Syntec Optics Holdings, Inc.",
  },
  {
    symbol: "KTCC",
    name: "Key Tronic Corporation",
  },
  {
    symbol: "HYMC",
    name: "Hycroft Mining Holding Corporation",
  },
  {
    symbol: "VRCA",
    name: "Verrica Pharmaceuticals Inc.",
  },
  {
    symbol: "PTHL",
    name: "Pheton Holdings Ltd",
  },
  {
    symbol: "CRGO",
    name: "Freightos Limited",
  },
  {
    symbol: "TELA",
    name: "TELA Bio, Inc.",
  },
  {
    symbol: "FORA",
    name: "Forian Inc.",
  },
  {
    symbol: "IMRX",
    name: "Immuneering Corporation",
  },
  {
    symbol: "FOXX",
    name: "Foxx Development Holdings Inc.",
  },
  {
    symbol: "NTRB",
    name: "Nutriband Inc.",
  },
  {
    symbol: "SNAL",
    name: "Snail, Inc.",
  },
  {
    symbol: "NSPR",
    name: "InspireMD, Inc.",
  },
  {
    symbol: "SHIM",
    name: "Shimmick Corporation",
  },
  {
    symbol: "SCNX",
    name: "Scienture Holdings, Inc.",
  },
  {
    symbol: "FDSB",
    name: "Fifth District Bancorp, Inc.",
  },
  {
    symbol: "CTXR",
    name: "Citius Pharmaceuticals, Inc.",
  },
  {
    symbol: "LNSR",
    name: "LENSAR, Inc.",
  },
  {
    symbol: "HGBL",
    name: "Heritage Global Inc.",
  },
  {
    symbol: "HTLM",
    name: "HomesToLife Ltd",
  },
  {
    symbol: "WFCF",
    name: "Where Food Comes From, Inc.",
  },
  {
    symbol: "STCN",
    name: "Steel Connect, Inc.",
  },
  {
    symbol: "LOAN",
    name: "Manhattan Bridge Capital, Inc.",
  },
  {
    symbol: "CAPN",
    name: "Cayson Acquisition Corp",
  },
  {
    symbol: "NA",
    name: "Nano Labs Ltd",
  },
  {
    symbol: "RAPT",
    name: "RAPT Therapeutics, Inc.",
  },
  {
    symbol: "LUNA",
    name: "Luna Innovations Incorporated",
  },
  {
    symbol: "CCG",
    name: "Cheche Group Inc.",
  },
  {
    symbol: "MDBH",
    name: "MDB Capital Holdings, LLC",
  },
  {
    symbol: "MITA",
    name: "Coliseum Acquisition Corp.",
  },
  {
    symbol: "JUNE",
    name: "Junee Limited",
  },
  {
    symbol: "RDZN",
    name: "Roadzen, Inc.",
  },
  {
    symbol: "DTIL",
    name: "Precision BioSciences, Inc.",
  },
  {
    symbol: "UG",
    name: "United-Guardian, Inc.",
  },
  {
    symbol: "BEAT",
    name: "HeartBeam, Inc.",
  },
  {
    symbol: "STTK",
    name: "Shattuck Labs, Inc.",
  },
  {
    symbol: "BOTJ",
    name: "Bank of the James Financial Group, Inc.",
  },
  {
    symbol: "GBBK",
    name: "Global Blockchain Acquisition Corp.",
  },
  {
    symbol: "MDIA",
    name: "MediaCo Holding Inc.",
  },
  {
    symbol: "AVTE",
    name: "Aerovate Therapeutics, Inc.",
  },
  {
    symbol: "RR",
    name: "Richtech Robotics Inc.",
  },
  {
    symbol: "THTX",
    name: "Theratechnologies Inc.",
  },
  {
    symbol: "DHAI",
    name: "DIH Holding US, Inc.",
  },
  {
    symbol: "NVNO",
    name: "enVVeno Medical Corporation",
  },
  {
    symbol: "YHNA",
    name: "YHN Acquisition I Limited",
  },
  {
    symbol: "LSB",
    name: "LakeShore Biopharma Co., Ltd",
  },
  {
    symbol: "HTCO",
    name: "Caravelle International Group",
  },
  {
    symbol: "UPLD",
    name: "Upland Software, Inc.",
  },
  {
    symbol: "RGC",
    name: "Regencell Bioscience Holdings Limited",
  },
  {
    symbol: "FOSL",
    name: "Fossil Group, Inc.",
  },
  {
    symbol: "MURA",
    name: "Mural Oncology plc",
  },
  {
    symbol: "CCTS",
    name: "Cactus Acquisition Corp. 1 Limited",
  },
  {
    symbol: "KZR",
    name: "Kezar Life Sciences, Inc.",
  },
  {
    symbol: "PLBY",
    name: "PLBY Group, Inc.",
  },
  {
    symbol: "CSBR",
    name: "Champions Oncology, Inc.",
  },
  {
    symbol: "PRE",
    name: "Prenetics Global Limited",
  },
  {
    symbol: "SELF",
    name: "Global Self Storage, Inc.",
  },
  {
    symbol: "BYFC",
    name: "Broadway Financial Corporation",
  },
  {
    symbol: "KRON",
    name: "Kronos Bio, Inc.",
  },
  {
    symbol: "IPWR",
    name: "Ideal Power Inc.",
  },
  {
    symbol: "CTSO",
    name: "Cytosorbents Corporation",
  },
  {
    symbol: "CPBI",
    name: "Central Plains Bancshares, Inc.",
  },
  {
    symbol: "NDLS",
    name: "Noodles & Company",
  },
  {
    symbol: "SGRP",
    name: "SPAR Group, Inc.",
  },
  {
    symbol: "BRNS",
    name: "Barinthus Biotherapeutics plc",
  },
  {
    symbol: "FGL",
    name: "Founder Group Limited",
  },
  {
    symbol: "BCOW",
    name: "1895 Bancorp of Wisconsin, Inc.",
  },
  {
    symbol: "BGM",
    name: "Qilian International Holding Group Limited",
  },
  {
    symbol: "NSTS",
    name: "NSTS Bancorp, Inc.",
  },
  {
    symbol: "ALGS",
    name: "Aligos Therapeutics, Inc.",
  },
  {
    symbol: "SYRS",
    name: "Syros Pharmaceuticals, Inc.",
  },
  {
    symbol: "ROCL",
    name: "Roth Ch Acquisition V Co.",
  },
  {
    symbol: "TORO",
    name: "Toro Corp.",
  },
  {
    symbol: "RGS",
    name: "Regis Corporation",
  },
  {
    symbol: "SCYX",
    name: "SCYNEXIS, Inc.",
  },
  {
    symbol: "PMAX",
    name: "Powell Max Limited",
  },
  {
    symbol: "PITA",
    name: "Heramba Electric plc",
  },
  {
    symbol: "FTHM",
    name: "Fathom Holdings Inc.",
  },
  {
    symbol: "GEG",
    name: "Great Elm Group, Inc.",
  },
  {
    symbol: "GRRR",
    name: "Gorilla Technology Group Inc.",
  },
  {
    symbol: "SKYQ",
    name: "Sky Quarry Inc.",
  },
  {
    symbol: "SSBI",
    name: "Summit State Bank",
  },
  {
    symbol: "BAFN",
    name: "BayFirst Financial Corp.",
  },
  {
    symbol: "ANGH",
    name: "Anghami Inc.",
  },
  {
    symbol: "FLNT",
    name: "Fluent, Inc.",
  },
  {
    symbol: "BRAC",
    name: "Broad Capital Acquisition Corp.",
  },
  {
    symbol: "SAG",
    name: "SAG Holdings Limited",
  },
  {
    symbol: "BUJA",
    name: "Bukit Jalil Global Acquisition 1 Ltd",
  },
  {
    symbol: "AISP",
    name: "Airship AI Holdings, Inc.",
  },
  {
    symbol: "PDYN",
    name: "Palladyne AI Corp.",
  },
  {
    symbol: "LVO",
    name: "LiveOne, Inc.",
  },
  {
    symbol: "EDRY",
    name: "EuroDry Ltd.",
  },
  {
    symbol: "HHS",
    name: "Harte Hanks, Inc.",
  },
  {
    symbol: "UONE",
    name: "Urban One, Inc.",
  },
  {
    symbol: "CLRC",
    name: "ClimateRock",
  },
  {
    symbol: "LVTX",
    name: "LAVA Therapeutics N.V.",
  },
  {
    symbol: "PAVS",
    name: "Paranovus Entertainment Technology Ltd.",
  },
  {
    symbol: "RDAC",
    name: "Rising Dragon Acquisition Corp.",
  },
  {
    symbol: "STBX",
    name: "Starbox Group Holdings Ltd.",
  },
  {
    symbol: "AFMD",
    name: "Affimed N.V.",
  },
  {
    symbol: "DWSN",
    name: "Dawson Geophysical Company",
  },
  {
    symbol: "GODN",
    name: "Golden Star Acquisition Corporation",
  },
  {
    symbol: "QNCX",
    name: "Quince Therapeutics, Inc.",
  },
  {
    symbol: "ELTX",
    name: "Elicio Therapeutics, Inc.",
  },
  {
    symbol: "PTLE",
    name: "PTL Limited",
  },
  {
    symbol: "OCX",
    name: "OncoCyte Corporation",
  },
  {
    symbol: "HOUR",
    name: "Hour Loop, Inc.",
  },
  {
    symbol: "CLST",
    name: "Catalyst Bancorp, Inc.",
  },
  {
    symbol: "OSS",
    name: "One Stop Systems, Inc.",
  },
  {
    symbol: "FLUX",
    name: "Flux Power Holdings, Inc.",
  },
  {
    symbol: "CPTN",
    name: "Cepton, Inc.",
  },
  {
    symbol: "RCON",
    name: "Recon Technology, Ltd.",
  },
  {
    symbol: "AQU",
    name: "Aquaron Acquisition Corp.",
  },
  {
    symbol: "COCH",
    name: "Envoy Medical, Inc.",
  },
  {
    symbol: "CRWS",
    name: "Crown Crafts, Inc.",
  },
  {
    symbol: "UONEK",
    name: "Urban One, Inc.",
  },
  {
    symbol: "MARX",
    name: "Mars Acquisition Corp.",
  },
  {
    symbol: "XGN",
    name: "Exagen Inc.",
  },
  {
    symbol: "ICAD",
    name: "iCAD, Inc.",
  },
  {
    symbol: "ANEB",
    name: "Anebulo Pharmaceuticals, Inc.",
  },
  {
    symbol: "FKWL",
    name: "Franklin Wireless Corp.",
  },
  {
    symbol: "MSAI",
    name: "MultiSensor AI Holdings, Inc.",
  },
  {
    symbol: "AIRE",
    name: "reAlpha Tech Corp.",
  },
  {
    symbol: "BMR",
    name: "Beamr Imaging Ltd.",
  },
  {
    symbol: "WAVE",
    name: "Eco Wave Power Global AB (publ)",
  },
  {
    symbol: "ALSA",
    name: "Alpha Star Acquisition Corporation",
  },
  {
    symbol: "IDN",
    name: "Intellicheck, Inc.",
  },
  {
    symbol: "PXS",
    name: "Pyxis Tankers Inc.",
  },
  {
    symbol: "VSAC",
    name: "Vision Sensing Acquisition Corp.",
  },
  {
    symbol: "ATRA",
    name: "Atara Biotherapeutics, Inc.",
  },
  {
    symbol: "AADI",
    name: "Aadi Bioscience, Inc.",
  },
  {
    symbol: "CELU",
    name: "Celularity Inc.",
  },
  {
    symbol: "VOR",
    name: "Vor Biopharma Inc.",
  },
  {
    symbol: "AGAE",
    name: "Allied Gaming & Entertainment Inc.",
  },
  {
    symbol: "FBIO",
    name: "Fortress Biotech, Inc.",
  },
  {
    symbol: "LEXX",
    name: "Lexaria Bioscience Corp.",
  },
  {
    symbol: "AIRT",
    name: "Air T, Inc.",
  },
  {
    symbol: "EHGO",
    name: "Eshallgo Inc.",
  },
  {
    symbol: "SHLT",
    name: "SHL Telemedicine Ltd.",
  },
  {
    symbol: "RECT",
    name: "Rectitude Holdings Ltd",
  },
  {
    symbol: "IPW",
    name: "iPower Inc.",
  },
  {
    symbol: "HOOK",
    name: "HOOKIPA Pharma Inc.",
  },
  {
    symbol: "MTEN",
    name: "Mingteng International Corporation Inc.",
  },
  {
    symbol: "CREX",
    name: "Creative Realities, Inc.",
  },
  {
    symbol: "INTE",
    name: "Integral Acquisition Corporation 1",
  },
  {
    symbol: "ASRV",
    name: "AmeriServ Financial, Inc.",
  },
  {
    symbol: "JG",
    name: "Aurora Mobile Limited",
  },
  {
    symbol: "LUCD",
    name: "Lucid Diagnostics Inc.",
  },
  {
    symbol: "IZEA",
    name: "IZEA Worldwide, Inc.",
  },
  {
    symbol: "KACL",
    name: "Kairous Acquisition Corp. Limited",
  },
  {
    symbol: "UCL",
    name: "uCloudlink Group Inc.",
  },
  {
    symbol: "GLST",
    name: "Global Star Acquisition, Inc.",
  },
  {
    symbol: "BNIX",
    name: "Bannix Acquisition Corp.",
  },
  {
    symbol: "NICK",
    name: "Nicholas Financial, Inc.",
  },
  {
    symbol: "MNY",
    name: "MoneyHero Limited",
  },
  {
    symbol: "BWEN",
    name: "Broadwind, Inc.",
  },
  {
    symbol: "DRRX",
    name: "DURECT Corporation",
  },
  {
    symbol: "CAPT",
    name: "Captivision Inc.",
  },
  {
    symbol: "FORL",
    name: "Four Leaf Acquisition Corporation",
  },
  {
    symbol: "PXLW",
    name: "Pixelworks, Inc.",
  },
  {
    symbol: "EYEN",
    name: "Eyenovia, Inc.",
  },
  {
    symbol: "STFS",
    name: "Star Fashion Culture Holdings Limited",
  },
  {
    symbol: "SMXT",
    name: "SolarMax Technology, Inc.",
  },
  {
    symbol: "OPHC",
    name: "OptimumBank Holdings, Inc.",
  },
  {
    symbol: "CALC",
    name: "CalciMedica, Inc.",
  },
  {
    symbol: "IGTA",
    name: "Inception Growth Acquisition Limited",
  },
  {
    symbol: "ICMB",
    name: "Investcorp Credit Management BDC, Inc.",
  },
  {
    symbol: "MATH",
    name: "Metalpha Technology Holding Limited",
  },
  {
    symbol: "BLAC",
    name: "Bellevue Life Sciences Acquisition Corp.",
  },
  {
    symbol: "NCSM",
    name: "NCS Multistage Holdings, Inc.",
  },
  {
    symbol: "CLGN",
    name: "CollPlant Biotechnologies Ltd.",
  },
  {
    symbol: "TCBS",
    name: "Texas Community Bancshares, Inc.",
  },
  {
    symbol: "DUET",
    name: "DUET Acquisition Corp.",
  },
  {
    symbol: "INTS",
    name: "Intensity Therapeutics, Inc.",
  },
  {
    symbol: "RFIL",
    name: "RF Industries, Ltd.",
  },
  {
    symbol: "SWIN",
    name: "Solowin Holdings",
  },
  {
    symbol: "PRPH",
    name: "ProPhase Labs, Inc.",
  },
  {
    symbol: "FEBO",
    name: "Fenbo Holdings Limited",
  },
  {
    symbol: "YOTA",
    name: "Yotta Acquisition Corporation",
  },
  {
    symbol: "AGMH",
    name: "AGM Group Holdings Inc.",
  },
  {
    symbol: "USEG",
    name: "U.S. Energy Corp.",
  },
  {
    symbol: "NOTV",
    name: "Inotiv, Inc.",
  },
  {
    symbol: "IMMX",
    name: "Immix Biopharma, Inc.",
  },
  {
    symbol: "DXR",
    name: "Daxor Corporation",
  },
  {
    symbol: "STI",
    name: "Solidion Technology Inc.",
  },
  {
    symbol: "DGHI",
    name: "Digihost Technology Inc.",
  },
  {
    symbol: "EQ",
    name: "Equillium, Inc.",
  },
  {
    symbol: "ARKR",
    name: "Ark Restaurants Corp.",
  },
  {
    symbol: "CFSB",
    name: "CFSB Bancorp, Inc.",
  },
  {
    symbol: "GIFT",
    name: "RDE, Inc.",
  },
  {
    symbol: "TACT",
    name: "TransAct Technologies Incorporated",
  },
  {
    symbol: "AWRE",
    name: "Aware, Inc.",
  },
  {
    symbol: "VIVK",
    name: "Vivakor, Inc.",
  },
  {
    symbol: "RAND",
    name: "Rand Capital Corporation",
  },
  {
    symbol: "AIXI",
    name: "Xiao-I Corporation",
  },
  {
    symbol: "ORKT",
    name: "Orangekloud Technology Inc.",
  },
  {
    symbol: "NVA",
    name: "Nova Minerals Limited",
  },
  {
    symbol: "CLNN",
    name: "Clene Inc.",
  },
  {
    symbol: "AXDX",
    name: "Accelerate Diagnostics, Inc.",
  },
  {
    symbol: "CLIR",
    name: "ClearSign Technologies Corporation",
  },
  {
    symbol: "ESGL",
    name: "ESGL Holdings Limited",
  },
  {
    symbol: "TRSG",
    name: "Tungray Technologies Inc.",
  },
  {
    symbol: "KSCP",
    name: "Knightscope, Inc.",
  },
  {
    symbol: "RDIB",
    name: "Reading International, Inc.",
  },
  {
    symbol: "CARM",
    name: "Carisma Therapeutics, Inc.",
  },
  {
    symbol: "HSON",
    name: "Hudson Global, Inc.",
  },
  {
    symbol: "BLRX",
    name: "BioLineRx Ltd.",
  },
  {
    symbol: "SYT",
    name: "SYLA Technologies Co., Ltd.",
  },
  {
    symbol: "TARA",
    name: "Protara Therapeutics, Inc.",
  },
  {
    symbol: "RLYB",
    name: "Rallybio Corporation",
  },
  {
    symbol: "BGFV",
    name: "Big 5 Sporting Goods Corporation",
  },
  {
    symbol: "GENK",
    name: "GEN Restaurant Group, Inc.",
  },
  {
    symbol: "DSWL",
    name: "Deswell Industries, Inc.",
  },
  {
    symbol: "FSEA",
    name: "First Seacoast Bancorp, Inc.",
  },
  {
    symbol: "HKIT",
    name: "Hitek Global Inc.",
  },
  {
    symbol: "RAVE",
    name: "Rave Restaurant Group, Inc.",
  },
  {
    symbol: "WAVS",
    name: "Western Acquisition Ventures Corp.",
  },
  {
    symbol: "XLO",
    name: "Xilio Therapeutics, Inc.",
  },
  {
    symbol: "HUIZ",
    name: "Huize Holding Limited",
  },
  {
    symbol: "NAAS",
    name: "NaaS Technology Inc.",
  },
  {
    symbol: "ACHL",
    name: "Achilles Therapeutics plc",
  },
  {
    symbol: "MNDO",
    name: "MIND C.T.I. Ltd",
  },
  {
    symbol: "CCLD",
    name: "CareCloud, Inc.",
  },
  {
    symbol: "BHIL",
    name: "Benson Hill, Inc.",
  },
  {
    symbol: "IXHL",
    name: "Incannex Healthcare Inc.",
  },
  {
    symbol: "PASG",
    name: "Passage Bio, Inc.",
  },
  {
    symbol: "HOLO",
    name: "MicroCloud Hologram Inc.",
  },
  {
    symbol: "VYNE",
    name: "VYNE Therapeutics Inc.",
  },
  {
    symbol: "YYGH",
    name: "YY Group Holding Limited",
  },
  {
    symbol: "CODX",
    name: "Co-Diagnostics, Inc.",
  },
  {
    symbol: "UNCY",
    name: "Unicycive Therapeutics, Inc.",
  },
  {
    symbol: "SJ",
    name: "Scienjoy Holding Corporation",
  },
  {
    symbol: "XTKG",
    name: "X3 Holdings Co., Ltd.",
  },
  {
    symbol: "PET",
    name: "Wag! Group Co.",
  },
  {
    symbol: "WINV",
    name: "WinVest Acquisition Corp.",
  },
  {
    symbol: "PRTS",
    name: "CarParts.com, Inc.",
  },
  {
    symbol: "FARM",
    name: "Farmer Bros. Co.",
  },
  {
    symbol: "RPID",
    name: "Rapid Micro Biosystems, Inc.",
  },
  {
    symbol: "XOS",
    name: "Xos, Inc.",
  },
  {
    symbol: "VGAS",
    name: "Verde Clean Fuels, Inc.",
  },
  {
    symbol: "ISPO",
    name: "Inspirato Incorporated",
  },
  {
    symbol: "CTRM",
    name: "Castor Maritime Inc.",
  },
  {
    symbol: "GDST",
    name: "Goldenstone Acquisition Limited",
  },
  {
    symbol: "CLPS",
    name: "CLPS Incorporation",
  },
  {
    symbol: "RENT",
    name: "Rent the Runway, Inc.",
  },
  {
    symbol: "USIO",
    name: "Usio, Inc.",
  },
  {
    symbol: "RVPH",
    name: "Reviva Pharmaceuticals Holdings, Inc.",
  },
  {
    symbol: "APYX",
    name: "Apyx Medical Corporation",
  },
  {
    symbol: "HFBL",
    name: "Home Federal Bancorp, Inc. of Louisiana",
  },
  {
    symbol: "VCSA",
    name: "Vacasa, Inc.",
  },
  {
    symbol: "NXTC",
    name: "NextCure, Inc.",
  },
  {
    symbol: "MCAG",
    name: "Mountain Crest Acquisition Corp. V",
  },
  {
    symbol: "JRSH",
    name: "Jerash Holdings (US), Inc.",
  },
  {
    symbol: "EBON",
    name: "Ebang International Holdings Inc.",
  },
  {
    symbol: "CENN",
    name: "Cenntro Inc.",
  },
  {
    symbol: "OKYO",
    name: "OKYO Pharma Limited",
  },
  {
    symbol: "KPLT",
    name: "Katapult Holdings, Inc.",
  },
  {
    symbol: "ABLV",
    name: "Able View Global Inc.",
  },
  {
    symbol: "LTRN",
    name: "Lantern Pharma Inc.",
  },
  {
    symbol: "MESA",
    name: "Mesa Air Group, Inc.",
  },
  {
    symbol: "JDZG",
    name: "JIADE Limited",
  },
  {
    symbol: "WTMA",
    name: "Welsbach Technology Metals Acquisition Corp.",
  },
  {
    symbol: "ELEV",
    name: "Elevation Oncology, Inc.",
  },
  {
    symbol: "XBP",
    name: "XBP Europe Holdings, Inc.",
  },
  {
    symbol: "TPCS",
    name: "TechPrecision Corporation",
  },
  {
    symbol: "CNVS",
    name: "Cineverse Corp.",
  },
  {
    symbol: "TLF",
    name: "Tandy Leather Factory, Inc.",
  },
  {
    symbol: "VTVT",
    name: "vTv Therapeutics Inc.",
  },
  {
    symbol: "ADGM",
    name: "Adagio Medical Holdings, Inc.",
  },
  {
    symbol: "DFLI",
    name: "Dragonfly Energy Holdings Corp.",
  },
  {
    symbol: "GLBS",
    name: "Globus Maritime Limited",
  },
  {
    symbol: "NTWK",
    name: "NetSol Technologies, Inc.",
  },
  {
    symbol: "BRFH",
    name: "Barfresh Food Group, Inc.",
  },
  {
    symbol: "NISN",
    name: "Nisun International Enterprise Development Group Co., Ltd",
  },
  {
    symbol: "MRKR",
    name: "Marker Therapeutics, Inc.",
  },
  {
    symbol: "LUMO",
    name: "Lumos Pharma, Inc.",
  },
  {
    symbol: "ECDA",
    name: "ECD Automotive Design, Inc.",
  },
  {
    symbol: "SYPR",
    name: "Sypris Solutions, Inc.",
  },
  {
    symbol: "WLGS",
    name: "WANG & LEE GROUP, Inc.",
  },
  {
    symbol: "PBBK",
    name: "PB Bankshares, Inc.",
  },
  {
    symbol: "GDTC",
    name: "CytoMed Therapeutics Limited",
  },
  {
    symbol: "BCG",
    name: "Binah Capital Group, Inc.",
  },
  {
    symbol: "LINK",
    name: "Interlink Electronics, Inc.",
  },
  {
    symbol: "SNT",
    name: "Senstar Technologies Corporation",
  },
  {
    symbol: "ALTS",
    name: "ALT5 Sigma Corporation",
  },
  {
    symbol: "ACST",
    name: "Acasti Pharma Inc.",
  },
  {
    symbol: "OMIC",
    name: "Singular Genomics Systems, Inc.",
  },
  {
    symbol: "FEAM",
    name: "5E Advanced Materials, Inc.",
  },
  {
    symbol: "SOND",
    name: "Sonder Holdings Inc.",
  },
  {
    symbol: "SURG",
    name: "SurgePays, Inc.",
  },
  {
    symbol: "SVMH",
    name: "SRIVARU Holding Limited",
  },
  {
    symbol: "NSYS",
    name: "Nortech Systems Incorporated",
  },
  {
    symbol: "OCEA",
    name: "Ocean Biomedical, Inc.",
  },
  {
    symbol: "GROW",
    name: "U.S. Global Investors, Inc.",
  },
  {
    symbol: "CMBM",
    name: "Cambium Networks Corporation",
  },
  {
    symbol: "AAME",
    name: "Atlantic American Corporation",
  },
  {
    symbol: "GTEC",
    name: "Greenland Technologies Holding Corporation",
  },
  {
    symbol: "DUOT",
    name: "Duos Technologies Group, Inc.",
  },
  {
    symbol: "ONCO",
    name: "Onconetix, Inc.",
  },
  {
    symbol: "MYNA",
    name: "Mynaric AG",
  },
  {
    symbol: "BCTX",
    name: "BriaCell Therapeutics Corp.",
  },
  {
    symbol: "SRZN",
    name: "Surrozen, Inc.",
  },
  {
    symbol: "DYAI",
    name: "Dyadic International, Inc.",
  },
  {
    symbol: "SLNH",
    name: "Soluna Holdings, Inc.",
  },
  {
    symbol: "ENLV",
    name: "Enlivex Therapeutics Ltd.",
  },
  {
    symbol: "RDI",
    name: "Reading International, Inc.",
  },
  {
    symbol: "CETY",
    name: "Clean Energy Technologies, Inc.",
  },
  {
    symbol: "DECA",
    name: "Denali Capital Acquisition Corp.",
  },
  {
    symbol: "MLEC",
    name: "Moolec Science SA",
  },
  {
    symbol: "ASPS",
    name: "Altisource Portfolio Solutions S.A.",
  },
  {
    symbol: "TURN",
    name: "180 Degree Capital Corp.",
  },
  {
    symbol: "FGEN",
    name: "FibroGen, Inc.",
  },
  {
    symbol: "OESX",
    name: "Orion Energy Systems, Inc.",
  },
  {
    symbol: "ANTX",
    name: "AN2 Therapeutics, Inc.",
  },
  {
    symbol: "BNAI",
    name: "Brand Engagement Network, Inc.",
  },
  {
    symbol: "AACG",
    name: "ATA Creativity Global",
  },
  {
    symbol: "APWC",
    name: "Asia Pacific Wire & Cable Corporation Limited",
  },
  {
    symbol: "GTIM",
    name: "Good Times Restaurants Inc.",
  },
  {
    symbol: "FPAY",
    name: "FlexShopper, Inc.",
  },
  {
    symbol: "HYFM",
    name: "Hydrofarm Holdings Group, Inc.",
  },
  {
    symbol: "FTEK",
    name: "Fuel Tech, Inc.",
  },
  {
    symbol: "CHR",
    name: "Cheer Holding, Inc.",
  },
  {
    symbol: "YYAI",
    name: "Connexa Sports Technologies Inc.",
  },
  {
    symbol: "GP",
    name: "GreenPower Motor Company Inc.",
  },
  {
    symbol: "LIVE",
    name: "Live Ventures Incorporated",
  },
  {
    symbol: "CDTG",
    name: "CDT Environmental Technology Investment Holdings Limited",
  },
  {
    symbol: "CRIS",
    name: "Curis, Inc.",
  },
  {
    symbol: "NMTC",
    name: "NeuroOne Medical Technologies Corporation",
  },
  {
    symbol: "STEC",
    name: "Santech Holdings Limited",
  },
  {
    symbol: "ESLA",
    name: "Estrella Immunopharma, Inc.",
  },
  {
    symbol: "DALN",
    name: "DallasNews Corporation",
  },
  {
    symbol: "OCUP",
    name: "Ocuphire Pharma, Inc.",
  },
  {
    symbol: "ICLK",
    name: "iClick Interactive Asia Group Limited",
  },
  {
    symbol: "LPCN",
    name: "Lipocine Inc.",
  },
  {
    symbol: "ELBM",
    name: "Electra Battery Materials Corporation",
  },
  {
    symbol: "INTG",
    name: "The InterGroup Corporation",
  },
  {
    symbol: "ACXP",
    name: "Acurx Pharmaceuticals, Inc.",
  },
  {
    symbol: "KALA",
    name: "KALA BIO, Inc.",
  },
  {
    symbol: "MIGI",
    name: "Mawson Infrastructure Group Inc.",
  },
  {
    symbol: "CLIK",
    name: "Click Holdings Limited",
  },
  {
    symbol: "DARE",
    name: "Daré Bioscience, Inc.",
  },
  {
    symbol: "EVTV",
    name: "Envirotech Vehicles, Inc.",
  },
  {
    symbol: "LGVN",
    name: "Longeveron Inc.",
  },
  {
    symbol: "STIM",
    name: "Neuronetics, Inc.",
  },
  {
    symbol: "SWVL",
    name: "Swvl Holdings Corp.",
  },
  {
    symbol: "MOVE",
    name: "Movano Inc.",
  },
  {
    symbol: "VSTE",
    name: "Vast Renewables Limited",
  },
  {
    symbol: "ZOOZ",
    name: "ZOOZ Power Ltd.",
  },
  {
    symbol: "BNR",
    name: "Burning Rock Biotech Limited",
  },
  {
    symbol: "HUDI",
    name: "Huadi International Group Co., Ltd.",
  },
  {
    symbol: "INKT",
    name: "MiNK Therapeutics, Inc.",
  },
  {
    symbol: "PMN",
    name: "ProMIS Neurosciences, Inc.",
  },
  {
    symbol: "QOMO",
    name: "Qomolangma Acquisition Corp.",
  },
  {
    symbol: "OM",
    name: "Outset Medical, Inc.",
  },
  {
    symbol: "MIND",
    name: "MIND Technology, Inc.",
  },
  {
    symbol: "SCOR",
    name: "comScore, Inc.",
  },
  {
    symbol: "VSEE",
    name: "VSee Health, Inc.",
  },
  {
    symbol: "DRIO",
    name: "DarioHealth Corp.",
  },
  {
    symbol: "ICCC",
    name: "ImmuCell Corporation",
  },
  {
    symbol: "ONMD",
    name: "OneMedNet Corporation",
  },
  {
    symbol: "CCTG",
    name: "CCSC Technology International Holdings Limited",
  },
  {
    symbol: "NAII",
    name: "Natural Alternatives International, Inc.",
  },
  {
    symbol: "BANL",
    name: "CBL International Limited",
  },
  {
    symbol: "PMEC",
    name: "Primech Holdings Ltd.",
  },
  {
    symbol: "AIFF",
    name: "Firefly Neuroscience, Inc.",
  },
  {
    symbol: "ICCM",
    name: "IceCure Medical Ltd",
  },
  {
    symbol: "AKTX",
    name: "Akari Therapeutics, Plc",
  },
  {
    symbol: "PODC",
    name: "PodcastOne, Inc.",
  },
  {
    symbol: "MKTW",
    name: "MarketWise, Inc.",
  },
  {
    symbol: "TPST",
    name: "Tempest Therapeutics, Inc.",
  },
  {
    symbol: "SOHO",
    name: "Sotherly Hotels Inc.",
  },
  {
    symbol: "FGF",
    name: "Fundamental Global Inc.",
  },
  {
    symbol: "FEMY",
    name: "Femasys Inc.",
  },
  {
    symbol: "ITRM",
    name: "Iterum Therapeutics plc",
  },
  {
    symbol: "SPAI",
    name: "Safe Pro Group Inc.",
  },
  {
    symbol: "BTM",
    name: "Bitcoin Depot Inc.",
  },
  {
    symbol: "NWGL",
    name: "Nature Wood Group Limited",
  },
  {
    symbol: "SHFS",
    name: "SHF Holdings, Inc.",
  },
  {
    symbol: "CNTM",
    name: "ConnectM Technology Solutions, Inc.",
  },
  {
    symbol: "UTSI",
    name: "UTStarcom Holdings Corp.",
  },
  {
    symbol: "IRIX",
    name: "IRIDEX Corporation",
  },
  {
    symbol: "PSHG",
    name: "Performance Shipping Inc.",
  },
  {
    symbol: "BNGO",
    name: "Bionano Genomics, Inc.",
  },
  {
    symbol: "QMCO",
    name: "Quantum Corporation",
  },
  {
    symbol: "KFFB",
    name: "Kentucky First Federal Bancorp",
  },
  {
    symbol: "POCI",
    name: "Precision Optics Corporation, Inc.",
  },
  {
    symbol: "AIEV",
    name: "Thunder Power Holdings, Inc.",
  },
  {
    symbol: "IINN",
    name: "Inspira Technologies Oxy B.H.N. Ltd.",
  },
  {
    symbol: "EPOW",
    name: "Sunrise New Energy Co., Ltd.",
  },
  {
    symbol: "GREE",
    name: "Greenidge Generation Holdings Inc.",
  },
  {
    symbol: "GAME",
    name: "GameSquare Holdings, Inc.",
  },
  {
    symbol: "MOGO",
    name: "Mogo Inc.",
  },
  {
    symbol: "BOLT",
    name: "Bolt Biotherapeutics, Inc.",
  },
  {
    symbol: "RAY",
    name: "Raytech Holding Limited",
  },
  {
    symbol: "SABS",
    name: "SAB Biotherapeutics, Inc.",
  },
  {
    symbol: "KIRK",
    name: "Kirkland's, Inc.",
  },
  {
    symbol: "TOI",
    name: "The Oncology Institute, Inc.",
  },
  {
    symbol: "FFIE",
    name: "Faraday Future Intelligent Electric Inc.",
  },
  {
    symbol: "UCAR",
    name: "U Power Limited",
  },
  {
    symbol: "BTAI",
    name: "BioXcel Therapeutics, Inc.",
  },
  {
    symbol: "HTCR",
    name: "HeartCore Enterprises, Inc.",
  },
  {
    symbol: "XTLB",
    name: "XTL Biopharmaceuticals Ltd.",
  },
  {
    symbol: "SPRB",
    name: "Spruce Biosciences, Inc.",
  },
  {
    symbol: "GRYP",
    name: "Gryphon Digital Mining, Inc.",
  },
  {
    symbol: "LSTA",
    name: "Lisata Therapeutics, Inc.",
  },
  {
    symbol: "DTST",
    name: "Data Storage Corporation",
  },
  {
    symbol: "NRBO",
    name: "NeuroBo Pharmaceuticals, Inc.",
  },
  {
    symbol: "CGTX",
    name: "Cognition Therapeutics, Inc.",
  },
  {
    symbol: "PYPD",
    name: "PolyPid Ltd.",
  },
  {
    symbol: "PLUR",
    name: "Pluri Inc.",
  },
  {
    symbol: "NRSN",
    name: "NeuroSense Therapeutics Ltd.",
  },
  {
    symbol: "MDAI",
    name: "Spectral AI, Inc.",
  },
  {
    symbol: "IZM",
    name: "ICZOOM Group Inc.",
  },
  {
    symbol: "GYRO",
    name: "Gyrodyne, LLC",
  },
  {
    symbol: "WKSP",
    name: "Worksport Ltd.",
  },
  {
    symbol: "HUDA",
    name: "Hudson Acquisition I Corp.",
  },
  {
    symbol: "NXL",
    name: "Nexalin Technology, Inc.",
  },
  {
    symbol: "JBDI",
    name: "JBDI Holdings Limited",
  },
  {
    symbol: "DAIO",
    name: "Data I/O Corporation",
  },
  {
    symbol: "TNXP",
    name: "Tonix Pharmaceuticals Holding Corp.",
  },
  {
    symbol: "PIRS",
    name: "Pieris Pharmaceuticals, Inc.",
  },
  {
    symbol: "RNXT",
    name: "RenovoRx, Inc.",
  },
  {
    symbol: "CYTH",
    name: "Cyclo Therapeutics, Inc.",
  },
  {
    symbol: "UBX",
    name: "Unity Biotechnology, Inc.",
  },
  {
    symbol: "ANY",
    name: "Sphere 3D Corp.",
  },
  {
    symbol: "FLGC",
    name: "Flora Growth Corp.",
  },
  {
    symbol: "TTOO",
    name: "T2 Biosystems, Inc.",
  },
  {
    symbol: "EKSO",
    name: "Ekso Bionics Holdings, Inc.",
  },
  {
    symbol: "XHG",
    name: "XChange TEC.INC",
  },
  {
    symbol: "SAIH",
    name: "SAIHEAT Limited",
  },
  {
    symbol: "WETH",
    name: "Wetouch Technology Inc.",
  },
  {
    symbol: "LRE",
    name: "Lead Real Estate Co., Ltd",
  },
  {
    symbol: "CVV",
    name: "CVD Equipment Corporation",
  },
  {
    symbol: "LFWD",
    name: "Lifeward Ltd.",
  },
  {
    symbol: "BIVI",
    name: "BioVie Inc.",
  },
  {
    symbol: "MOBX",
    name: "Mobix Labs, Inc.",
  },
  {
    symbol: "CXAI",
    name: "CXApp Inc.",
  },
  {
    symbol: "JZ",
    name: "Jianzhi Education Technology Group Company Limited",
  },
  {
    symbol: "APRE",
    name: "Aprea Therapeutics, Inc.",
  },
  {
    symbol: "RMCF",
    name: "Rocky Mountain Chocolate Factory, Inc.",
  },
  {
    symbol: "NVNI",
    name: "Nvni Group Limited",
  },
  {
    symbol: "BBGI",
    name: "Beasley Broadcast Group, Inc.",
  },
  {
    symbol: "BRLT",
    name: "Brilliant Earth Group, Inc.",
  },
  {
    symbol: "RETO",
    name: "ReTo Eco-Solutions, Inc.",
  },
  {
    symbol: "CGBS",
    name: "Crown LNG Holdings Limited",
  },
  {
    symbol: "BDMD",
    name: "Baird Medical Investment Holdings Limited",
  },
  {
    symbol: "TKLF",
    name: "Yoshitsu Co., Ltd",
  },
  {
    symbol: "LSH",
    name: "Lakeside Holding Limited",
  },
  {
    symbol: "CMMB",
    name: "Chemomab Therapeutics Ltd.",
  },
  {
    symbol: "NXPL",
    name: "NextPlat Corp",
  },
  {
    symbol: "CPSH",
    name: "CPS Technologies Corporation",
  },
  {
    symbol: "LOBO",
    name: "Lobo EV Technologies Ltd.",
  },
  {
    symbol: "USEA",
    name: "United Maritime Corporation",
  },
  {
    symbol: "NCNC",
    name: "noco-noco Inc.",
  },
  {
    symbol: "SWAG",
    name: "Stran & Company, Inc.",
  },
  {
    symbol: "AQMS",
    name: "Aqua Metals, Inc.",
  },
  {
    symbol: "NXGL",
    name: "NEXGEL, Inc.",
  },
  {
    symbol: "BTCS",
    name: "BTCS Inc.",
  },
  {
    symbol: "COOT",
    name: "Australian Oilseeds Holdings Limited",
  },
  {
    symbol: "SDOT",
    name: "Sadot Group Inc.",
  },
  {
    symbol: "MSS",
    name: "Maison Solutions Inc.",
  },
  {
    symbol: "PSIG",
    name: "PS International Group Ltd.",
  },
  {
    symbol: "COCP",
    name: "Cocrystal Pharma, Inc.",
  },
  {
    symbol: "CMLS",
    name: "Cumulus Media Inc.",
  },
  {
    symbol: "OCC",
    name: "Optical Cable Corporation",
  },
  {
    symbol: "JFU",
    name: "9F Inc.",
  },
  {
    symbol: "ZKIN",
    name: "ZK International Group Co., Ltd.",
  },
  {
    symbol: "ROMA",
    name: "Roma Green Finance Limited",
  },
  {
    symbol: "JYD",
    name: "Jayud Global Logistics Limited",
  },
  {
    symbol: "UGRO",
    name: "urban-gro, Inc.",
  },
  {
    symbol: "ATER",
    name: "Aterian, Inc.",
  },
  {
    symbol: "EMKR",
    name: "EMCORE Corporation",
  },
  {
    symbol: "WKHS",
    name: "Workhorse Group Inc.",
  },
  {
    symbol: "MGIH",
    name: "Millennium Group International Holdings Limited",
  },
  {
    symbol: "XELB",
    name: "Xcel Brands, Inc.",
  },
  {
    symbol: "PEV",
    name: "Phoenix Motor Inc.",
  },
  {
    symbol: "HCWB",
    name: "HCW Biologics Inc.",
  },
  {
    symbol: "IKT",
    name: "Inhibikase Therapeutics, Inc.",
  },
  {
    symbol: "XAIR",
    name: "Beyond Air, Inc.",
  },
  {
    symbol: "TOMZ",
    name: "TOMI Environmental Solutions, Inc.",
  },
  {
    symbol: "HWH",
    name: "HWH International Inc.",
  },
  {
    symbol: "PALT",
    name: "Paltalk, Inc.",
  },
  {
    symbol: "YHGJ",
    name: "Yunhong Green CTI Ltd.",
  },
  {
    symbol: "CPOP",
    name: "Pop Culture Group Co., Ltd",
  },
  {
    symbol: "APCX",
    name: "AppTech Payments Corp.",
  },
  {
    symbol: "DUO",
    name: "Fangdd Network Group Ltd.",
  },
  {
    symbol: "LRHC",
    name: "La Rosa Holdings Corp.",
  },
  {
    symbol: "FCUV",
    name: "Focus Universal Inc.",
  },
  {
    symbol: "JVA",
    name: "Coffee Holding Co., Inc.",
  },
  {
    symbol: "MIRA",
    name: "MIRA Pharmaceuticals, Inc.",
  },
  {
    symbol: "MKDW",
    name: "MKDWELL Tech Inc.",
  },
  {
    symbol: "GOVX",
    name: "GeoVax Labs, Inc.",
  },
  {
    symbol: "MEIP",
    name: "MEI Pharma, Inc.",
  },
  {
    symbol: "TXMD",
    name: "TherapeuticsMD, Inc.",
  },
  {
    symbol: "ATHA",
    name: "Athira Pharma, Inc.",
  },
  {
    symbol: "SLGL",
    name: "Sol-Gel Technologies Ltd.",
  },
  {
    symbol: "ILAG",
    name: "Intelligent Living Application Group Inc.",
  },
  {
    symbol: "GSIW",
    name: "Garden Stage Limited",
  },
  {
    symbol: "SEED",
    name: "Origin Agritech Limited",
  },
  {
    symbol: "SONM",
    name: "Sonim Technologies, Inc.",
  },
  {
    symbol: "CVKD",
    name: "Cadrenal Therapeutics, Inc.",
  },
  {
    symbol: "BFRG",
    name: "Bullfrog AI Holdings, Inc.",
  },
  {
    symbol: "MHUA",
    name: "Meihua International Medical Technologies Co., Ltd.",
  },
  {
    symbol: "TURB",
    name: "Turbo Energy, S.A.",
  },
  {
    symbol: "WHLM",
    name: "Wilhelmina International, Inc.",
  },
  {
    symbol: "GORV",
    name: "Lazydays Holdings, Inc.",
  },
  {
    symbol: "GDC",
    name: "GD Culture Group Limited",
  },
  {
    symbol: "CPIX",
    name: "Cumberland Pharmaceuticals Inc.",
  },
  {
    symbol: "BIAF",
    name: "bioAffinity Technologies, Inc.",
  },
  {
    symbol: "SGMA",
    name: "SigmaTron International, Inc.",
  },
  {
    symbol: "EDUC",
    name: "Educational Development Corporation",
  },
  {
    symbol: "TRIB",
    name: "Trinity Biotech plc",
  },
  {
    symbol: "BOSC",
    name: "B.O.S. Better Online Solutions Ltd.",
  },
  {
    symbol: "NERV",
    name: "Minerva Neurosciences, Inc.",
  },
  {
    symbol: "TAIT",
    name: "Taitron Components Incorporated",
  },
  {
    symbol: "SYBX",
    name: "Synlogic, Inc.",
  },
  {
    symbol: "WVVI",
    name: "Willamette Valley Vineyards, Inc.",
  },
  {
    symbol: "LYRA",
    name: "Lyra Therapeutics, Inc.",
  },
  {
    symbol: "AEI",
    name: "Alset Inc.",
  },
  {
    symbol: "RAYA",
    name: "Erayak Power Solution Group Inc.",
  },
  {
    symbol: "VRM",
    name: "Vroom, Inc.",
  },
  {
    symbol: "MRNS",
    name: "Marinus Pharmaceuticals, Inc.",
  },
  {
    symbol: "TLPH",
    name: "Talphera, Inc.",
  },
  {
    symbol: "TENX",
    name: "Tenax Therapeutics, Inc.",
  },
  {
    symbol: "SUGP",
    name: "SU Group Holdings Limited",
  },
  {
    symbol: "FLYE",
    name: "Fly-E Group, Inc.",
  },
  {
    symbol: "IPA",
    name: "ImmunoPrecise Antibodies Ltd.",
  },
  {
    symbol: "GVP",
    name: "GSE Systems, Inc.",
  },
  {
    symbol: "OXBR",
    name: "Oxbridge Re Holdings Limited",
  },
  {
    symbol: "PT",
    name: "Pintec Technology Holdings Limited",
  },
  {
    symbol: "MBOT",
    name: "Microbot Medical Inc.",
  },
  {
    symbol: "KZIA",
    name: "Kazia Therapeutics Limited",
  },
  {
    symbol: "HLP",
    name: "Hongli Group Inc.",
  },
  {
    symbol: "AWH",
    name: "Aspira Women's Health Inc.",
  },
  {
    symbol: "VISL",
    name: "Vislink Technologies, Inc.",
  },
  {
    symbol: "GLBZ",
    name: "Glen Burnie Bancorp",
  },
  {
    symbol: "PXDT",
    name: "Pixie Dust Technologies, Inc.",
  },
  {
    symbol: "ICU",
    name: "SeaStar Medical Holding Corporation",
  },
  {
    symbol: "EDTK",
    name: "Skillful Craftsman Education Technology Limited",
  },
  {
    symbol: "JCTC",
    name: "Jewett-Cameron Trading Company Ltd.",
  },
  {
    symbol: "INDP",
    name: "Indaptus Therapeutics, Inc.",
  },
  {
    symbol: "ABTS",
    name: "Abits Group Inc.",
  },
  {
    symbol: "EZFL",
    name: "EZFill Holdings Inc.",
  },
  {
    symbol: "JZXN",
    name: "Jiuzi Holdings, Inc.",
  },
  {
    symbol: "MTEK",
    name: "Maris-Tech Ltd.",
  },
  {
    symbol: "INAB",
    name: "IN8bio, Inc.",
  },
  {
    symbol: "GIGM",
    name: "GigaMedia Limited",
  },
  {
    symbol: "SMSI",
    name: "Smith Micro Software, Inc.",
  },
  {
    symbol: "SNSE",
    name: "Sensei Biotherapeutics, Inc.",
  },
  {
    symbol: "QTI",
    name: "QT Imaging Holdings, Inc.",
  },
  {
    symbol: "EVAX",
    name: "Evaxion Biotech A/S",
  },
  {
    symbol: "CWD",
    name: "CaliberCos Inc.",
  },
  {
    symbol: "MNDR",
    name: "Mobile-health Network Solutions",
  },
  {
    symbol: "LUCY",
    name: "Innovative Eyewear, Inc.",
  },
  {
    symbol: "MRM",
    name: "MEDIROM Healthcare Technologies Inc.",
  },
  {
    symbol: "APLM",
    name: "Apollomics, Inc.",
  },
  {
    symbol: "BHAT",
    name: "Blue Hat Interactive Entertainment Technology",
  },
  {
    symbol: "ABVE",
    name: "Above Food Ingredients Inc.",
  },
  {
    symbol: "CNFR",
    name: "Conifer Holdings, Inc.",
  },
  {
    symbol: "WKEY",
    name: "WISeKey International Holding AG",
  },
  {
    symbol: "HUBC",
    name: "HUB Cyber Security Ltd.",
  },
  {
    symbol: "NEPH",
    name: "Nephros, Inc.",
  },
  {
    symbol: "DLPN",
    name: "Dolphin Entertainment, Inc.",
  },
  {
    symbol: "MTEX",
    name: "Mannatech, Incorporated",
  },
  {
    symbol: "EVGN",
    name: "Evogene Ltd.",
  },
  {
    symbol: "CING",
    name: "Cingulate Inc.",
  },
  {
    symbol: "RMCO",
    name: "Royalty Management Holding Corporation",
  },
  {
    symbol: "CARA",
    name: "Cara Therapeutics, Inc.",
  },
  {
    symbol: "NKGN",
    name: "NKGen Biotech, Inc.",
  },
  {
    symbol: "CLRO",
    name: "ClearOne, Inc.",
  },
  {
    symbol: "VRME",
    name: "VerifyMe, Inc.",
  },
  {
    symbol: "NCRA",
    name: "Nocera, Inc.",
  },
  {
    symbol: "PMCB",
    name: "PharmaCyte Biotech, Inc.",
  },
  {
    symbol: "MNTS",
    name: "Momentus Inc.",
  },
  {
    symbol: "PMD",
    name: "Psychemedics Corporation",
  },
  {
    symbol: "FMST",
    name: "Foremost Clean Energy Ltd.",
  },
  {
    symbol: "MDRR",
    name: "Medalist Diversified REIT, Inc.",
  },
  {
    symbol: "INTJ",
    name: "Intelligent Group Limited",
  },
  {
    symbol: "BSLK",
    name: "Bolt Projects Holdings, Inc.",
  },
  {
    symbol: "ELSE",
    name: "Electro-Sensors, Inc.",
  },
  {
    symbol: "RVYL",
    name: "Ryvyl Inc.",
  },
  {
    symbol: "COSM",
    name: "Cosmos Health Inc.",
  },
  {
    symbol: "SPI",
    name: "SPI Energy Co., Ltd.",
  },
  {
    symbol: "MCVT",
    name: "Mill City Ventures III, Ltd.",
  },
  {
    symbol: "IMNN",
    name: "Imunon, Inc.",
  },
  {
    symbol: "PC",
    name: "Premium Catering (Holdings) Limited",
  },
  {
    symbol: "MMV",
    name: "MultiMetaVerse Holdings Limited",
  },
  {
    symbol: "PETZ",
    name: "TDH Holdings, Inc.",
  },
  {
    symbol: "CSCI",
    name: "COSCIENS Biopharma Inc.",
  },
  {
    symbol: "CUTR",
    name: "Cutera, Inc.",
  },
  {
    symbol: "AYTU",
    name: "Aytu BioPharma, Inc.",
  },
  {
    symbol: "DTSS",
    name: "Datasea Inc.",
  },
  {
    symbol: "SSKN",
    name: "STRATA Skin Sciences, Inc.",
  },
  {
    symbol: "NCI",
    name: "Neo-Concept International Group Holdings Limited",
  },
  {
    symbol: "NRXP",
    name: "NRx Pharmaceuticals, Inc.",
  },
  {
    symbol: "BIOR",
    name: "Biora Therapeutics, Inc.",
  },
  {
    symbol: "VCIG",
    name: "VCI Global Limited",
  },
  {
    symbol: "OP",
    name: "OceanPal Inc.",
  },
  {
    symbol: "VVOS",
    name: "Vivos Therapeutics, Inc.",
  },
  {
    symbol: "CISS",
    name: "C3is Inc.",
  },
  {
    symbol: "JL",
    name: "J-Long Group Limited",
  },
  {
    symbol: "VRAR",
    name: "The Glimpse Group, Inc.",
  },
  {
    symbol: "ASTC",
    name: "Astrotech Corporation",
  },
  {
    symbol: "XELA",
    name: "Exela Technologies, Inc.",
  },
  {
    symbol: "BREA",
    name: "Brera Holdings PLC",
  },
  {
    symbol: "BTOG",
    name: "Bit Origin Ltd",
  },
  {
    symbol: "GMM",
    name: "Global Mofy AI Limited",
  },
  {
    symbol: "CJJD",
    name: "China Jo-Jo Drugstores, Inc.",
  },
  {
    symbol: "STRR",
    name: "Star Equity Holdings, Inc.",
  },
  {
    symbol: "LAES",
    name: "SEALSQ Corp",
  },
  {
    symbol: "IPDN",
    name: "Professional Diversity Network, Inc.",
  },
  {
    symbol: "IMRN",
    name: "Immuron Limited",
  },
  {
    symbol: "VINC",
    name: "Vincerx Pharma, Inc.",
  },
  {
    symbol: "NIXX",
    name: "Nixxy, Inc.",
  },
  {
    symbol: "CLWT",
    name: "Euro Tech Holdings Company Limited",
  },
  {
    symbol: "TSBX",
    name: "Turnstone Biologics Corp.",
  },
  {
    symbol: "GVH",
    name: "Globavend Holdings Limited",
  },
  {
    symbol: "DPRO",
    name: "Draganfly Inc.",
  },
  {
    symbol: "BOF",
    name: "BranchOut Food Inc.",
  },
  {
    symbol: "CDT",
    name: "Conduit Pharmaceuticals Inc.",
  },
  {
    symbol: "GCTK",
    name: "GlucoTrack, Inc.",
  },
  {
    symbol: "GFAI",
    name: "Guardforce AI Co., Limited",
  },
  {
    symbol: "AMPG",
    name: "AmpliTech Group, Inc.",
  },
  {
    symbol: "KLTO",
    name: "Klotho Neurosciences, Inc.",
  },
  {
    symbol: "BLMZ",
    name: "BloomZ Inc.",
  },
  {
    symbol: "BLIN",
    name: "Bridgeline Digital, Inc.",
  },
  {
    symbol: "AMIX",
    name: "Autonomix Medical, Inc.",
  },
  {
    symbol: "DOMH",
    name: "Dominari Holdings Inc.",
  },
  {
    symbol: "OMEX",
    name: "Odyssey Marine Exploration, Inc.",
  },
  {
    symbol: "LIQT",
    name: "LiqTech International, Inc.",
  },
  {
    symbol: "RNAZ",
    name: "TransCode Therapeutics, Inc.",
  },
  {
    symbol: "GLYC",
    name: "GlycoMimetics, Inc.",
  },
  {
    symbol: "WTO",
    name: "UTime Limited",
  },
  {
    symbol: "SRM",
    name: "SRM Entertainment, Inc.",
  },
  {
    symbol: "VRAX",
    name: "Virax Biolabs Group Limited",
  },
  {
    symbol: "EEIQ",
    name: "EpicQuest Education Group International Limited",
  },
  {
    symbol: "BTBD",
    name: "BT Brands, Inc.",
  },
  {
    symbol: "FRSX",
    name: "Foresight Autonomous Holdings Ltd.",
  },
  {
    symbol: "UBXG",
    name: "U-BX Technology Ltd.",
  },
  {
    symbol: "BRTX",
    name: "BioRestorative Therapies, Inc.",
  },
  {
    symbol: "YQ",
    name: "17 Education & Technology Group Inc.",
  },
  {
    symbol: "BYU",
    name: "BAIYU Holdings, Inc.",
  },
  {
    symbol: "HOFV",
    name: "Hall of Fame Resort & Entertainment Company",
  },
  {
    symbol: "GIPR",
    name: "Generation Income Properties, Inc.",
  },
  {
    symbol: "CMCT",
    name: "Creative Media & Community Trust Corporation",
  },
  {
    symbol: "BLBX",
    name: "Blackboxstocks Inc.",
  },
  {
    symbol: "MBIO",
    name: "Mustang Bio, Inc.",
  },
  {
    symbol: "QNTM",
    name: "Quantum BioPharma Ltd.",
  },
  {
    symbol: "NIVF",
    name: "NewGenIvf Group Limited",
  },
  {
    symbol: "KPRX",
    name: "Kiora Pharmaceuticals, Inc.",
  },
  {
    symbol: "EDSA",
    name: "Edesa Biotech, Inc.",
  },
  {
    symbol: "ZAPP",
    name: "Zapp Electric Vehicles Group Limited",
  },
  {
    symbol: "ATHE",
    name: "Alterity Therapeutics Limited",
  },
  {
    symbol: "HRYU",
    name: "Hanryu Holdings, Inc.",
  },
  {
    symbol: "MFI",
    name: "mF International Limited",
  },
  {
    symbol: "SIDU",
    name: "Sidus Space, Inc.",
  },
  {
    symbol: "LIDR",
    name: "AEye, Inc.",
  },
  {
    symbol: "JAGX",
    name: "Jaguar Health, Inc.",
  },
  {
    symbol: "PAVM",
    name: "PAVmed Inc.",
  },
  {
    symbol: "HTOO",
    name: "Fusion Fuel Green PLC",
  },
  {
    symbol: "ULY",
    name: "Urgent.ly Inc.",
  },
  {
    symbol: "DRCT",
    name: "Direct Digital Holdings, Inc.",
  },
  {
    symbol: "ATIF",
    name: "ATIF Holdings Limited",
  },
  {
    symbol: "RDHL",
    name: "RedHill Biopharma Ltd.",
  },
  {
    symbol: "CJET",
    name: "Chijet Motor Company, Inc.",
  },
  {
    symbol: "SOGP",
    name: "Sound Group Inc.",
  },
  {
    symbol: "HYZN",
    name: "Hyzon Motors Inc.",
  },
  {
    symbol: "MEGL",
    name: "Magic Empire Global Limited",
  },
  {
    symbol: "CISO",
    name: "CISO Global Inc.",
  },
  {
    symbol: "BCLI",
    name: "Brainstorm Cell Therapeutics Inc.",
  },
  {
    symbol: "TCTM",
    name: "TCTM Kids IT Education Inc.",
  },
  {
    symbol: "YJ",
    name: "Yunji Inc.",
  },
  {
    symbol: "WHLR",
    name: "Wheeler Real Estate Investment Trust, Inc.",
  },
  {
    symbol: "OMH",
    name: "Ohmyhome Limited",
  },
  {
    symbol: "SNTI",
    name: "Senti Biosciences, Inc.",
  },
  {
    symbol: "RVSN",
    name: "Rail Vision Ltd.",
  },
  {
    symbol: "SLE",
    name: "Super League Enterprise, Inc.",
  },
  {
    symbol: "ADXN",
    name: "Addex Therapeutics Ltd",
  },
  {
    symbol: "ADD",
    name: "Color Star Technology Co., Ltd.",
  },
  {
    symbol: "WISA",
    name: "WiSA Technologies, Inc.",
  },
  {
    symbol: "VIRX",
    name: "Viracta Therapeutics, Inc.",
  },
  {
    symbol: "SCKT",
    name: "Socket Mobile, Inc.",
  },
  {
    symbol: "PRPO",
    name: "Precipio, Inc.",
  },
  {
    symbol: "APM",
    name: "Aptorum Group Limited",
  },
  {
    symbol: "XWEL",
    name: "XWELL, Inc.",
  },
  {
    symbol: "TRAW",
    name: "Traws Pharma, Inc.",
  },
  {
    symbol: "MDJH",
    name: "MDJM Ltd",
  },
  {
    symbol: "GDHG",
    name: "Golden Heaven Group Holdings Ltd.",
  },
  {
    symbol: "HIHO",
    name: "Highway Holdings Limited",
  },
  {
    symbol: "TRUG",
    name: "TruGolf Holdings, Inc.",
  },
  {
    symbol: "LEDS",
    name: "SemiLEDs Corporation",
  },
  {
    symbol: "CARV",
    name: "Carver Bancorp, Inc.",
  },
  {
    symbol: "AIHS",
    name: "Senmiao Technology Limited",
  },
  {
    symbol: "AKTS",
    name: "Akoustis Technologies, Inc.",
  },
  {
    symbol: "VCNX",
    name: "Vaccinex, Inc.",
  },
  {
    symbol: "ARBB",
    name: "ARB IOT Group Limited",
  },
  {
    symbol: "GWAV",
    name: "Greenwave Technology Solutions, Inc.",
  },
  {
    symbol: "ABVC",
    name: "ABVC BioPharma, Inc.",
  },
  {
    symbol: "FGI",
    name: "FGI Industries Ltd.",
  },
  {
    symbol: "KRKR",
    name: "36Kr Holdings Inc.",
  },
  {
    symbol: "MOB",
    name: "Mobilicom Limited",
  },
  {
    symbol: "SQFT",
    name: "Presidio Property Trust, Inc.",
  },
  {
    symbol: "JXJT",
    name: "JX Luxventure Limited",
  },
  {
    symbol: "SNGX",
    name: "Soligenix, Inc.",
  },
  {
    symbol: "BCDA",
    name: "BioCardia, Inc.",
  },
  {
    symbol: "COEP",
    name: "Coeptis Therapeutics Holdings, Inc.",
  },
  {
    symbol: "NUZE",
    name: "NuZee, Inc.",
  },
  {
    symbol: "UPC",
    name: "Universe Pharmaceuticals INC",
  },
  {
    symbol: "ASNS",
    name: "Actelis Networks, Inc.",
  },
  {
    symbol: "INHD",
    name: "Inno Holdings Inc.",
  },
  {
    symbol: "WAFU",
    name: "Wah Fu Education Group Limited",
  },
  {
    symbol: "NURO",
    name: "NeuroMetrix, Inc.",
  },
  {
    symbol: "ARTW",
    name: "Art's-Way Manufacturing Co., Inc.",
  },
  {
    symbol: "ZCMD",
    name: "Zhongchao Inc.",
  },
  {
    symbol: "STRM",
    name: "Streamline Health Solutions, Inc.",
  },
  {
    symbol: "MARPS",
    name: "Marine Petroleum Trust",
  },
  {
    symbol: "LMFA",
    name: "LM Funding America, Inc.",
  },
  {
    symbol: "PSTV",
    name: "Plus Therapeutics, Inc.",
  },
  {
    symbol: "WBUY",
    name: "Webuy Global Ltd",
  },
  {
    symbol: "LDTC",
    name: "LeddarTech Holdings Inc.",
  },
  {
    symbol: "EJH",
    name: "E-Home Household Service Holdings Limited",
  },
  {
    symbol: "GLTO",
    name: "Galecto, Inc.",
  },
  {
    symbol: "ZEO",
    name: "Zeo Energy Corp.",
  },
  {
    symbol: "NXTT",
    name: "Next Technology Holding Inc.",
  },
  {
    symbol: "POLA",
    name: "Polar Power, Inc.",
  },
  {
    symbol: "GNPX",
    name: "Genprex, Inc.",
  },
  {
    symbol: "VERB",
    name: "Verb Technology Company, Inc.",
  },
  {
    symbol: "CYCN",
    name: "Cyclerion Therapeutics, Inc.",
  },
  {
    symbol: "GURE",
    name: "Gulf Resources, Inc.",
  },
  {
    symbol: "PPBT",
    name: "Purple Biotech Ltd",
  },
  {
    symbol: "LUXH",
    name: "LuxUrban Hotels Inc.",
  },
  {
    symbol: "OTRK",
    name: "Ontrak, Inc.",
  },
  {
    symbol: "HOVR",
    name: "New Horizon Aircraft Ltd.",
  },
  {
    symbol: "CYN",
    name: "Cyngn Inc.",
  },
  {
    symbol: "ALCE",
    name: "Alternus Clean Energy Inc",
  },
  {
    symbol: "REBN",
    name: "Reborn Coffee, Inc.",
  },
  {
    symbol: "VS",
    name: "Versus Systems Inc.",
  },
  {
    symbol: "YGMZ",
    name: "MingZhu Logistics Holdings Limited",
  },
  {
    symbol: "CTCX",
    name: "Carmell Corporation",
  },
  {
    symbol: "PULM",
    name: "Pulmatrix, Inc.",
  },
  {
    symbol: "NXU",
    name: "Nxu, Inc.",
  },
  {
    symbol: "ALZN",
    name: "Alzamend Neuro, Inc.",
  },
  {
    symbol: "ONVO",
    name: "Organovo Holdings, Inc.",
  },
  {
    symbol: "PWM",
    name: "Prestige Wealth Inc.",
  },
  {
    symbol: "MBRX",
    name: "Moleculin Biotech, Inc.",
  },
  {
    symbol: "CHNR",
    name: "China Natural Resources, Inc.",
  },
  {
    symbol: "APTO",
    name: "Aptose Biosciences Inc.",
  },
  {
    symbol: "LGCB",
    name: "Linkage Global Inc",
  },
  {
    symbol: "JNVR",
    name: "Janover Inc.",
  },
  {
    symbol: "TFFP",
    name: "TFF Pharmaceuticals, Inc.",
  },
  {
    symbol: "MYNZ",
    name: "Mainz Biomed N.V.",
  },
  {
    symbol: "ADIL",
    name: "Adial Pharmaceuticals, Inc.",
  },
  {
    symbol: "SYRA",
    name: "Syra Health Corp.",
  },
  {
    symbol: "BGLC",
    name: "BioNexus Gene Lab Corp.",
  },
  {
    symbol: "GRNQ",
    name: "Greenpro Capital Corp.",
  },
  {
    symbol: "RGF",
    name: "The Real Good Food Company, Inc.",
  },
  {
    symbol: "AMST",
    name: "Amesite Inc.",
  },
  {
    symbol: "EFOI",
    name: "Energy Focus, Inc.",
  },
  {
    symbol: "JCSE",
    name: "JE Cleantech Holdings Limited",
  },
  {
    symbol: "GSUN",
    name: "Golden Sun Health Technology Group Limited",
  },
  {
    symbol: "PNBK",
    name: "Patriot National Bancorp, Inc.",
  },
  {
    symbol: "CREV",
    name: "Carbon Revolution Public Limited Company",
  },
  {
    symbol: "ENG",
    name: "ENGlobal Corporation",
  },
  {
    symbol: "FBRX",
    name: "Forte Biosciences, Inc.",
  },
  {
    symbol: "GTBP",
    name: "GT Biopharma, Inc.",
  },
  {
    symbol: "CHEK",
    name: "Check-Cap Ltd.",
  },
  {
    symbol: "PRZO",
    name: "ParaZero Technologies Ltd.",
  },
  {
    symbol: "SPCB",
    name: "SuperCom Ltd.",
  },
  {
    symbol: "MGOL",
    name: "MGO Global, Inc.",
  },
  {
    symbol: "CREG",
    name: "Smart Powerr Corp.",
  },
  {
    symbol: "MRIN",
    name: "Marin Software Incorporated",
  },
  {
    symbol: "CDIO",
    name: "Cardio Diagnostics Holdings, Inc.",
  },
  {
    symbol: "SNTG",
    name: "Sentage Holdings Inc.",
  },
  {
    symbol: "OCG",
    name: "Oriental Culture Holding LTD",
  },
  {
    symbol: "PRTG",
    name: "Portage Biotech Inc.",
  },
  {
    symbol: "FTFT",
    name: "Future FinTech Group Inc.",
  },
  {
    symbol: "KAVL",
    name: "Kaival Brands Innovations Group, Inc.",
  },
  {
    symbol: "VSME",
    name: "VS MEDIA Holdings Limited",
  },
  {
    symbol: "CMAX",
    name: "CareMax, Inc.",
  },
  {
    symbol: "DWTX",
    name: "Dogwood Therapeutics, Inc.",
  },
  {
    symbol: "YOSH",
    name: "Yoshiharu Global Co.",
  },
  {
    symbol: "KDLY",
    name: "Kindly MD, Inc.",
  },
  {
    symbol: "ELWS",
    name: "Earlyworks Co., Ltd",
  },
  {
    symbol: "CMND",
    name: "Clearmind Medicine Inc.",
  },
  {
    symbol: "LCFY",
    name: "Locafy Limited",
  },
  {
    symbol: "BNOX",
    name: "Bionomics Limited",
  },
  {
    symbol: "LITM",
    name: "Snow Lake Resources Ltd.",
  },
  {
    symbol: "KITT",
    name: "Nauticus Robotics, Inc.",
  },
  {
    symbol: "AEHL",
    name: "Antelope Enterprise Holdings Limited",
  },
  {
    symbol: "HAO",
    name: "Haoxi Health Technology Limited",
  },
  {
    symbol: "SMX",
    name: "SMX (Security Matters) Public Limited Company",
  },
  {
    symbol: "TGL",
    name: "Treasure Global Inc.",
  },
  {
    symbol: "INBS",
    name: "Intelligent Bio Solutions Inc.",
  },
  {
    symbol: "BNRG",
    name: "Brenmiller Energy Ltd",
  },
  {
    symbol: "LDWY",
    name: "Lendway, Inc.",
  },
  {
    symbol: "IBG",
    name: "Innovation Beverage Group Limited",
  },
  {
    symbol: "GLMD",
    name: "Galmed Pharmaceuticals Ltd.",
  },
  {
    symbol: "ZCAR",
    name: "Zoomcar Holdings, Inc.",
  },
  {
    symbol: "BENF",
    name: "Beneficient",
  },
  {
    symbol: "ATPC",
    name: "Agape ATP Corporation",
  },
  {
    symbol: "RKDA",
    name: "Arcadia Biosciences, Inc.",
  },
  {
    symbol: "HOTH",
    name: "Hoth Therapeutics, Inc.",
  },
  {
    symbol: "MGRX",
    name: "Mangoceuticals, Inc.",
  },
  {
    symbol: "BON",
    name: "Bon Natural Life Limited",
  },
  {
    symbol: "XBIO",
    name: "Xenetic Biosciences, Inc.",
  },
  {
    symbol: "NDRA",
    name: "ENDRA Life Sciences Inc.",
  },
  {
    symbol: "SGLY",
    name: "Singularity Future Technology Ltd.",
  },
  {
    symbol: "ANTE",
    name: "AirNet Technology Inc.",
  },
  {
    symbol: "CEAD",
    name: "CEA Industries Inc.",
  },
  {
    symbol: "AGRI",
    name: "AgriFORCE Growing Systems Ltd.",
  },
  {
    symbol: "OST",
    name: "Ostin Technology Group Co., Ltd.",
  },
  {
    symbol: "BFRI",
    name: "Biofrontera Inc.",
  },
  {
    symbol: "SANW",
    name: "S&W Seed Company",
  },
  {
    symbol: "NUKK",
    name: "Nukkleus Inc.",
  },
  {
    symbol: "ONFO",
    name: "Onfolio Holdings, Inc.",
  },
  {
    symbol: "CRKN",
    name: "Crown Electrokinetics Corp.",
  },
  {
    symbol: "BCAN",
    name: "Femto Technologies Inc.",
  },
  {
    symbol: "AEMD",
    name: "Aethlon Medical, Inc.",
  },
  {
    symbol: "ERNA",
    name: "Eterna Therapeutics Inc.",
  },
  {
    symbol: "SILO",
    name: "Silo Pharma, Inc.",
  },
  {
    symbol: "ADN",
    name: "Advent Technologies Holdings, Inc.",
  },
  {
    symbol: "SISI",
    name: "Shineco, Inc.",
  },
  {
    symbol: "AYRO",
    name: "Ayro, Inc.",
  },
  {
    symbol: "SPPL",
    name: "Simpple Ltd.",
  },
  {
    symbol: "BMRA",
    name: "Biomerica, Inc.",
  },
  {
    symbol: "XRTX",
    name: "XORTX Therapeutics Inc.",
  },
  {
    symbol: "FAMI",
    name: "Farmmi, Inc.",
  },
  {
    symbol: "JTAI",
    name: "Jet.AI Inc.",
  },
  {
    symbol: "NMHI",
    name: "Nature's Miracle Holding Inc.",
  },
  {
    symbol: "PRSO",
    name: "Peraso Inc.",
  },
  {
    symbol: "INTZ",
    name: "Intrusion Inc.",
  },
  {
    symbol: "LKCO",
    name: "Luokung Technology Corp.",
  },
  {
    symbol: "SMTK",
    name: "SmartKem, Inc.",
  },
  {
    symbol: "TIRX",
    name: "Tian Ruixiang Holdings Ltd",
  },
  {
    symbol: "PIK",
    name: "Kidpik Corp.",
  },
  {
    symbol: "POAI",
    name: "Predictive Oncology Inc.",
  },
  {
    symbol: "ENVB",
    name: "Enveric Biosciences, Inc.",
  },
  {
    symbol: "MULN",
    name: "Mullen Automotive, Inc.",
  },
  {
    symbol: "LFLY",
    name: "Leafly Holdings, Inc.",
  },
  {
    symbol: "BOXL",
    name: "Boxlight Corporation",
  },
  {
    symbol: "GV",
    name: "Visionary Holdings Inc.",
  },
  {
    symbol: "CNSP",
    name: "CNS Pharmaceuticals, Inc.",
  },
  {
    symbol: "IMCC",
    name: "IM Cannabis Corp.",
  },
  {
    symbol: "NLSP",
    name: "NLS Pharmaceutics AG",
  },
  {
    symbol: "ELAB",
    name: "Elevai Labs Inc.",
  },
  {
    symbol: "CELZ",
    name: "Creative Medical Technology Holdings, Inc.",
  },
  {
    symbol: "LIFW",
    name: "MSP Recovery, Inc.",
  },
  {
    symbol: "LXEH",
    name: "Lixiang Education Holding Co., Ltd.",
  },
  {
    symbol: "BTCT",
    name: "BTC Digital Ltd.",
  },
  {
    symbol: "DATS",
    name: "DatChat, Inc.",
  },
  {
    symbol: "AGFY",
    name: "Agrify Corporation",
  },
  {
    symbol: "VEEE",
    name: "Twin Vee Powercats Co.",
  },
  {
    symbol: "ONCT",
    name: "Oncternal Therapeutics, Inc.",
  },
  {
    symbol: "MLGO",
    name: "MicroAlgo Inc.",
  },
  {
    symbol: "ENSC",
    name: "Ensysce Biosciences, Inc.",
  },
  {
    symbol: "AIMD",
    name: "Ainos, Inc.",
  },
  {
    symbol: "IDAI",
    name: "T Stamp Inc.",
  },
  {
    symbol: "CERO",
    name: "CERo Therapeutics Holdings, Inc.",
  },
  {
    symbol: "XCUR",
    name: "Exicure, Inc.",
  },
  {
    symbol: "AQB",
    name: "AquaBounty Technologies, Inc.",
  },
  {
    symbol: "PCSA",
    name: "Processa Pharmaceuticals, Inc.",
  },
  {
    symbol: "NVOS",
    name: "Novo Integrated Sciences, Inc.",
  },
  {
    symbol: "HEPA",
    name: "Hepion Pharmaceuticals, Inc.",
  },
  {
    symbol: "KTTA",
    name: "Pasithea Therapeutics Corp.",
  },
  {
    symbol: "TNFA",
    name: "TNF Pharmaceuticals, Inc.",
  },
  {
    symbol: "SVRE",
    name: "SaverOne 2014 Ltd.",
  },
  {
    symbol: "EVOK",
    name: "Evoke Pharma, Inc.",
  },
  {
    symbol: "LTRY",
    name: "Lottery.com Inc.",
  },
  {
    symbol: "WLDS",
    name: "Wearable Devices Ltd.",
  },
  {
    symbol: "MSGM",
    name: "Motorsport Games Inc.",
  },
  {
    symbol: "SNPX",
    name: "Synaptogenix, Inc.",
  },
  {
    symbol: "MTEM",
    name: "Molecular Templates, Inc.",
  },
  {
    symbol: "LIPO",
    name: "Lipella Pharmaceuticals Inc.",
  },
  {
    symbol: "NCNA",
    name: "NuCana plc",
  },
  {
    symbol: "INM",
    name: "InMed Pharmaceuticals Inc.",
  },
  {
    symbol: "PALI",
    name: "Palisade Bio, Inc.",
  },
  {
    symbol: "WATT",
    name: "Energous Corporation",
  },
  {
    symbol: "SONN",
    name: "Sonnet BioTherapeutics Holdings, Inc.",
  },
  {
    symbol: "ATXG",
    name: "Addentax Group Corp.",
  },
  {
    symbol: "DGLY",
    name: "Digital Ally, Inc.",
  },
  {
    symbol: "ATNF",
    name: "180 Life Sciences Corp.",
  },
  {
    symbol: "RIME",
    name: "Algorhythm Holdings, Inc.",
  },
  {
    symbol: "VINO",
    name: "Gaucho Group Holdings, Inc.",
  },
  {
    symbol: "OLB",
    name: "The OLB Group, Inc.",
  },
  {
    symbol: "OBLG",
    name: "Oblong, Inc.",
  },
  {
    symbol: "VLCN",
    name: "Volcon, Inc.",
  },
  {
    symbol: "FORD",
    name: "Forward Industries, Inc.",
  },
  {
    symbol: "SNOA",
    name: "Sonoma Pharmaceuticals, Inc.",
  },
  {
    symbol: "BDRX",
    name: "Biodexa Pharmaceuticals Plc",
  },
  {
    symbol: "NVFY",
    name: "Nova LifeStyle, Inc.",
  },
  {
    symbol: "JWEL",
    name: "Jowell Global Ltd.",
  },
  {
    symbol: "PIXY",
    name: "ShiftPixy, Inc.",
  },
  {
    symbol: "IFBD",
    name: "Infobird Co., Ltd",
  },
  {
    symbol: "GENE",
    name: "Genetic Technologies Limited",
  },
  {
    symbol: "CTHR",
    name: "Charles & Colvard, Ltd.",
  },
  {
    symbol: "ARTL",
    name: "Artelo Biosciences, Inc.",
  },
  {
    symbol: "AUUD",
    name: "Auddia Inc.",
  },
  {
    symbol: "LYT",
    name: "Lytus Technologies Holdings PTV. Ltd.",
  },
  {
    symbol: "XTIA",
    name: "XTI Aerospace, Inc.",
  },
  {
    symbol: "TTNP",
    name: "Titan Pharmaceuticals, Inc.",
  },
  {
    symbol: "OCTO",
    name: "Eightco Holdings Inc.",
  },
  {
    symbol: "BBLG",
    name: "Bone Biologics Corporation",
  },
  {
    symbol: "LIXT",
    name: "Lixte Biotechnology Holdings, Inc.",
  },
  {
    symbol: "STSS",
    name: "Sharps Technology, Inc.",
  },
  {
    symbol: "IVDA",
    name: "Iveda Solutions, Inc.",
  },
  {
    symbol: "FRES",
    name: "Fresh2 Group Limited",
  },
  {
    symbol: "PTPI",
    name: "Petros Pharmaceuticals, Inc.",
  },
  {
    symbol: "TCRT",
    name: "Alaunos Therapeutics, Inc.",
  },
  {
    symbol: "ZPTA",
    name: "Zapata Computing Holdings Inc.",
  },
  {
    symbol: "SYTA",
    name: "Siyata Mobile Inc.",
  },
  {
    symbol: "VERO",
    name: "Venus Concept Inc.",
  },
  {
    symbol: "VVPR",
    name: "VivoPower International PLC",
  },
  {
    symbol: "BAOS",
    name: "Baosheng Media Group Holdings Limited",
  },
  {
    symbol: "ISPC",
    name: "iSpecimen Inc.",
  },
  {
    symbol: "NAYA",
    name: "NAYA Biosciences, Inc.",
  },
  {
    symbol: "SBFM",
    name: "Sunshine Biopharma, Inc.",
  },
  {
    symbol: "LQR",
    name: "LQR House Inc.",
  },
  {
    symbol: "ASST",
    name: "Asset Entities Inc.",
  },
  {
    symbol: "APVO",
    name: "Aptevo Therapeutics Inc.",
  },
  {
    symbol: "QNRX",
    name: "Quoin Pharmaceuticals, Ltd.",
  },
  {
    symbol: "IMTE",
    name: "Integrated Media Technology Limited",
  },
  {
    symbol: "NTRP",
    name: "NextTrip, Inc.",
  },
  {
    symbol: "CNET",
    name: "ZW Data Action Technologies Inc.",
  },
  {
    symbol: "ALBT",
    name: "Avalon GloboCare Corp.",
  },
  {
    symbol: "SPGC",
    name: "Sacks Parente Golf, Inc.",
  },
  {
    symbol: "APDN",
    name: "Applied DNA Sciences, Inc.",
  },
  {
    symbol: "ICON",
    name: "Icon Energy Corp.",
  },
  {
    symbol: "UPXI",
    name: "Upexi, Inc.",
  },
  {
    symbol: "SOPA",
    name: "Society Pass Incorporated",
  },
  {
    symbol: "EZGO",
    name: "EZGO Technologies Ltd.",
  },
  {
    symbol: "WINT",
    name: "Windtree Therapeutics, Inc.",
  },
  {
    symbol: "TAOP",
    name: "Taoping Inc.",
  },
  {
    symbol: "HCTI",
    name: "Healthcare Triangle, Inc.",
  },
  {
    symbol: "NUWE",
    name: "Nuwellis, Inc.",
  },
  {
    symbol: "VRPX",
    name: "Virpax Pharmaceuticals, Inc.",
  },
  {
    symbol: "SGD",
    name: "Safe and Green Development Corporation",
  },
  {
    symbol: "RELI",
    name: "Reliance Global Group, Inc.",
  },
  {
    symbol: "HSCS",
    name: "Heart Test Laboratories, Inc.",
  },
  {
    symbol: "ICCT",
    name: "iCoreConnect Inc.",
  },
  {
    symbol: "QLGN",
    name: "Qualigen Therapeutics, Inc.",
  },
  {
    symbol: "SCNI",
    name: "Scinai Immunotherapeutics Ltd.",
  },
  {
    symbol: "ATXI",
    name: "Avenue Therapeutics, Inc.",
  },
  {
    symbol: "SNES",
    name: "SenesTech, Inc.",
  },
  {
    symbol: "RSLS",
    name: "ReShape Lifesciences Inc.",
  },
  {
    symbol: "SHPH",
    name: "Shuttle Pharmaceuticals Holdings, Inc.",
  },
  {
    symbol: "PTIX",
    name: "Protagenic Therapeutics, Inc.",
  },
  {
    symbol: "AREB",
    name: "American Rebel Holdings, Inc.",
  },
  {
    symbol: "XXII",
    name: "22nd Century Group, Inc.",
  },
  {
    symbol: "ASTI",
    name: "Ascent Solar Technologies, Inc.",
  },
  {
    symbol: "BPTH",
    name: "Bio-Path Holdings, Inc.",
  },
  {
    symbol: "SLXN",
    name: "Silexion Therapeutics Corp",
  },
  {
    symbol: "TC",
    name: "TuanChe Limited",
  },
  {
    symbol: "SBET",
    name: "SharpLink Gaming, Inc.",
  },
  {
    symbol: "SNAX",
    name: "Stryve Foods, Inc.",
  },
  {
    symbol: "KWE",
    name: "KWESST Micro Systems Inc.",
  },
  {
    symbol: "NVVE",
    name: "Nuvve Holding Corp.",
  },
  {
    symbol: "WNW",
    name: "Meiwu Technology Company Limited",
  },
  {
    symbol: "XYLO",
    name: "Xylo Technologies Ltd",
  },
  {
    symbol: "VEV",
    name: "Vicinity Motor Corp.",
  },
  {
    symbol: "PHIO",
    name: "Phio Pharmaceuticals Corp.",
  },
  {
    symbol: "JFBR",
    name: "Jeffs' Brands Ltd",
  },
  {
    symbol: "SOBR",
    name: "SOBR Safe, Inc.",
  },
  {
    symbol: "SLRX",
    name: "Salarius Pharmaceuticals, Inc.",
  },
  {
    symbol: "GRI",
    name: "GRI Bio, Inc.",
  },
  {
    symbol: "SINT",
    name: "Sintx Technologies, Inc.",
  },
  {
    symbol: "THAR",
    name: "Tharimmune, Inc.",
  },
  {
    symbol: "ENTO",
    name: "Entero Therapeutics, Inc.",
  },
  {
    symbol: "ZVSA",
    name: "ZyVersa Therapeutics, Inc.",
  },
  {
    symbol: "BACK",
    name: "IMAC Holdings, Inc.",
  },
  {
    symbol: "ACON",
    name: "Aclarion, Inc.",
  },
  {
    symbol: "BNZI",
    name: "Banzai International, Inc.",
  },
  {
    symbol: "VMAR",
    name: "Vision Marine Technologies Inc.",
  },
  {
    symbol: "SGBX",
    name: "Safe & Green Holdings Corp.",
  },
  {
    symbol: "SXTC",
    name: "China SXT Pharmaceuticals, Inc.",
  },
  {
    symbol: "DRMA",
    name: "Dermata Therapeutics, Inc.",
  },
  {
    symbol: "ALLR",
    name: "Allarity Therapeutics, Inc.",
  },
  {
    symbol: "NITO",
    name: "N2OFF, Inc.",
  },
  {
    symbol: "AVGR",
    name: "Avinger, Inc.",
  },
  {
    symbol: "WORX",
    name: "SCWorx Corp.",
  },
  {
    symbol: "AKAN",
    name: "Akanda Corp.",
  },
  {
    symbol: "XPON",
    name: "Expion360 Inc.",
  },
  {
    symbol: "HSDT",
    name: "Helius Medical Technologies, Inc.",
  },
  {
    symbol: "UK",
    name: "Ucommune International Ltd",
  },
  {
    symbol: "STAF",
    name: "Staffing 360 Solutions, Inc.",
  },
  {
    symbol: "TIVC",
    name: "Tivic Health Systems, Inc.",
  },
  {
    symbol: "TNON",
    name: "Tenon Medical, Inc.",
  },
  {
    symbol: "MYSZ",
    name: "My Size, Inc.",
  },
  {
    symbol: "CNEY",
    name: "CN Energy Group. Inc.",
  },
  {
    symbol: "CYCC",
    name: "Cyclacel Pharmaceuticals, Inc.",
  },
  {
    symbol: "CYTO",
    name: "Altamira Therapeutics Ltd.",
  },
  {
    symbol: "GXAI",
    name: "Gaxos.ai Inc.",
  },
  {
    symbol: "BJDX",
    name: "Bluejay Diagnostics, Inc.",
  },
  {
    symbol: "SXTP",
    name: "60 Degrees Pharmaceuticals, Inc.",
  },
  {
    symbol: "EDBL",
    name: "Edible Garden AG Incorporated",
  },
  {
    symbol: "PBM",
    name: "Psyence Biomedical Ltd.",
  },
  {
    symbol: "TANH",
    name: "Tantech Holdings Ltd",
  },
  {
    symbol: "NAOV",
    name: "NanoVibronix, Inc.",
  },
  {
    symbol: "BKYI",
    name: "BIO-key International, Inc.",
  },
  {
    symbol: "PEGY",
    name: "Pineapple Energy Inc.",
  },
  {
    symbol: "REVB",
    name: "Revelation Biosciences, Inc.",
  },
  {
    symbol: "GNLN",
    name: "Greenlane Holdings, Inc.",
  },
  {
    symbol: "LGHL",
    name: "Lion Group Holding Ltd.",
  },
  {
    symbol: "BSFC",
    name: "Blue Star Foods Corp.",
  },
  {
    symbol: "NCPL",
    name: "Netcapital Inc.",
  },
  {
    symbol: "EAST",
    name: "Eastside Distilling, Inc.",
  },
  {
    symbol: "TCBP",
    name: "TC Biopharm (Holdings) Plc",
  },
  {
    symbol: "IVP",
    name: "Inspire Veterinary Partners, Inc.",
  },
  {
    symbol: "PRFX",
    name: "PainReform Ltd.",
  },
  {
    symbol: "TRNR",
    name: "Interactive Strength Inc.",
  },
  {
    symbol: "SPRC",
    name: "SciSparc Ltd.",
  },
  {
    symbol: "DBGI",
    name: "Digital Brands Group, Inc.",
  },
  {
    symbol: "LGMK",
    name: "LogicMark, Inc.",
  },
  {
    symbol: "STKH",
    name: "Steakholder Foods Ltd.",
  },
  {
    symbol: "KXIN",
    name: "Kaixin Holdings",
  },
  {
    symbol: "CETX",
    name: "Cemtrex, Inc.",
  },
  {
    symbol: "ADTX",
    name: "Aditxt, Inc.",
  },
];

// async function main() {
//   console.log("Start seeding...");

//   for (const company of NASDAQcompanies) {
//     await prisma.company.upsert({
//       where: { symbol: company.symbol },
//       update: {},
//       create: {
//         symbol: company.symbol,
//         name: company.name,
//         exchange: "NASDAQ",
//         // Note: marketCap, price, and revenue are set to null as they're not provided in the input data
//         marketCap: null,
//         price: null,
//         revenue: null,
//       },
//     });
//   }

//   console.log("Seeding finished.");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
