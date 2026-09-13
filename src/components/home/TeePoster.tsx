import type { TeeVariant } from "@/components/home/TeeCanvas";

/** Code-rendered design preview: visible before JavaScript or WebGL is ready. */
export default function TeePoster({ variant }: { variant: TeeVariant }) {
  return <svg viewBox="0 0 600 500" role="img" aria-label="T-shirt design preview" className="h-full w-full drop-shadow-2xl">
    <defs><linearGradient id="tee-light" x1="0" x2="1"><stop stopColor="white" stopOpacity=".2"/><stop offset=".5" stopColor="white" stopOpacity="0"/><stop offset="1" stopColor="black" stopOpacity=".25"/></linearGradient></defs>
    <g transform="translate(0 12)">
      <path d="M230 65 L180 88 L95 170 L155 226 L190 191 L182 420 Q300 443 418 420 L410 191 L445 226 L505 170 L420 88 L370 65 Q300 101 230 65Z" fill={variant.color}/>
      <path d="M230 65 Q300 101 370 65 Q355 124 300 125 Q245 124 230 65Z" fill="#161313" opacity=".45"/>
      <path d="M230 65 L180 88 L95 170 L155 226 L190 191 L182 420 Q300 443 418 420 L410 191 L445 226 L505 170 L420 88 L370 65 Q300 101 230 65Z" fill="url(#tee-light)"/>
      <path d="M196 184 L207 391 M404 184 L393 391 M190 412 Q300 432 410 412" fill="none" stroke="black" strokeOpacity=".12" strokeWidth="2"/>
      <image href={variant.print} x={300 - variant.printWidth * 250} y="158" width={variant.printWidth * 500} height="160" preserveAspectRatio="xMidYMin meet"/>
    </g>
  </svg>;
}
