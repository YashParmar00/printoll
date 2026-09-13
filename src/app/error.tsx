"use client";
export default function StoreError({ reset }: { reset: () => void }) { return <div className="container-page min-h-96 py-20"><h1 className="text-3xl">This page is temporarily unavailable</h1><button type="button" className="btn-primary mt-6" onClick={reset}>Try again</button></div>; }
