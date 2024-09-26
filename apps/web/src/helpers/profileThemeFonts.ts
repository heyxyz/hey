import {
  Aboreto,
  Akaya_Kanadaka,
  Archivo,
  Archivo_Narrow,
  Arimo,
  Audiowide,
  BioRhyme,
  DM_Mono,
  Eczar,
  Gaegu,
  IBM_Plex_Mono,
  IBM_Plex_Serif,
  Inconsolata,
  Inter,
  Inter_Tight,
  Karla,
  Libre_Baskerville,
  Michroma,
  Nunito,
  Playfair_Display,
  Poppins,
  Red_Rose,
  Rubik,
  Space_Grotesk,
  Space_Mono,
  Spline_Sans,
  Spline_Sans_Mono,
  Syne_Tactile,
  Viaoda_Libre,
  Wallpoet,
  Work_Sans,
  Xanh_Mono,
  Zen_Dots
} from "next/font/google";

export enum Font {
  Aboreto = "aboreto",
  AkayaKanadaka = "akayaKanadaka",
  Archivo = "archivo",
  ArchivoNarrow = "archivoNarrow",
  Arimo = "arimo",
  Audiowide = "audiowide",
  Poppins = "poppins",
  Nunito = "nunito",
  ZenDots = "zenDots",
  XanhMono = "xanhMono",
  WorkSans = "workSans",
  Wallpoet = "wallpoet",
  ViaodaLibre = "viaodaLibre",
  SyneTactile = "syneTactile",
  SplineSansMono = "splineSansMono",
  SplineSans = "splineSans",
  SpaceMono = "spaceMono",
  SpaceGrotesk = "spaceGrotesk",
  Rubik = "rubik",
  RedRose = "redRose",
  PlayfairDisplay = "playfairDisplay",
  Michroma = "michroma",
  Karla = "karla",
  LibreBaskerville = "libreBaskerville",
  Inter = "inter",
  InterTight = "interTight",
  Inconsolata = "inconsolata",
  IBMPlexSerif = "ibmPlexSerif",
  IBMPlexMono = "ibmPlexMono",
  Gaegu = "gaegu",
  Eczar = "eczar",
  DMMono = "dmMono",
  BioRhyme = "bioRhyme"
}

const aboreto = Aboreto({ subsets: ["latin"], weight: "400" });
const akayaKanadaka = Akaya_Kanadaka({ subsets: ["latin"], weight: "400" });
const archivo = Archivo({ subsets: ["latin"], weight: "400" });
const archivoNarrow = Archivo_Narrow({ subsets: ["latin"], weight: "400" });
const arimo = Arimo({ subsets: ["latin"], weight: "400" });
const audiowide = Audiowide({ subsets: ["latin"], weight: "400" });
const poppins = Poppins({ subsets: ["latin"], weight: "400" });
const nunito = Nunito({ subsets: ["latin"], weight: "400" });
const zenDots = Zen_Dots({ subsets: ["latin"], weight: "400" });
const xanhMono = Xanh_Mono({ subsets: ["latin"], weight: "400" });
const workSans = Work_Sans({ subsets: ["latin"], weight: "400" });
const wallpoet = Wallpoet({ subsets: ["latin"], weight: "400" });
const viaodaLibre = Viaoda_Libre({ subsets: ["latin"], weight: "400" });
const syneTactile = Syne_Tactile({ subsets: ["latin"], weight: "400" });
const splineSansMono = Spline_Sans_Mono({ subsets: ["latin"], weight: "400" });
const splineSans = Spline_Sans({ subsets: ["latin"], weight: "400" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: "400" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: "400" });
const rubik = Rubik({ subsets: ["latin"], weight: "400" });
const redRose = Red_Rose({ subsets: ["latin"], weight: "400" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], weight: "400" });
const michroma = Michroma({ subsets: ["latin"], weight: "400" });
const karla = Karla({ subsets: ["latin"], weight: "400" });
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: "400"
});
const inter = Inter({ subsets: ["latin"], weight: "400" });
const interTight = Inter_Tight({ subsets: ["latin"], weight: "400" });
const inconsolata = Inconsolata({ subsets: ["latin"], weight: "400" });
const ibmPlexSerif = IBM_Plex_Serif({ subsets: ["latin"], weight: "400" });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400" });
const gaegu = Gaegu({ subsets: ["latin"], weight: "400" });
const eczar = Eczar({ subsets: ["latin"], weight: "400" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: "400" });
const bioRhyme = BioRhyme({ subsets: ["latin"], weight: "400" });

const profileThemeFonts = (id: string | undefined): string => {
  if (!id) {
    return "";
  }

  switch (id) {
    case Font.Aboreto:
      return aboreto.className;
    case Font.AkayaKanadaka:
      return akayaKanadaka.className;
    case Font.Archivo:
      return archivo.className;
    case Font.ArchivoNarrow:
      return archivoNarrow.className;
    case Font.Arimo:
      return arimo.className;
    case Font.Audiowide:
      return audiowide.className;
    case Font.Poppins:
      return poppins.className;
    case Font.Nunito:
      return nunito.className;
    case Font.ZenDots:
      return zenDots.className;
    case Font.XanhMono:
      return xanhMono.className;
    case Font.WorkSans:
      return workSans.className;
    case Font.Wallpoet:
      return wallpoet.className;
    case Font.ViaodaLibre:
      return viaodaLibre.className;
    case Font.SyneTactile:
      return syneTactile.className;
    case Font.SplineSansMono:
      return splineSansMono.className;
    case Font.SplineSans:
      return splineSans.className;
    case Font.SpaceMono:
      return spaceMono.className;
    case Font.SpaceGrotesk:
      return spaceGrotesk.className;
    case Font.Rubik:
      return rubik.className;
    case Font.RedRose:
      return redRose.className;
    case Font.PlayfairDisplay:
      return playfairDisplay.className;
    case Font.Michroma:
      return michroma.className;
    case Font.Karla:
      return karla.className;
    case Font.LibreBaskerville:
      return libreBaskerville.className;
    case Font.Inter:
      return inter.className;
    case Font.InterTight:
      return interTight.className;
    case Font.Inconsolata:
      return inconsolata.className;
    case Font.IBMPlexSerif:
      return ibmPlexSerif.className;
    case Font.IBMPlexMono:
      return ibmPlexMono.className;
    case Font.Gaegu:
      return gaegu.className;
    case Font.Eczar:
      return eczar.className;
    case Font.DMMono:
      return dmMono.className;
    case Font.BioRhyme:
      return bioRhyme.className;
    default:
      return "";
  }
};

export default profileThemeFonts;
