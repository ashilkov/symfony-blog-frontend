export function getIdFromIri(iri: string): string {
    if (!iri) return '';
    // drop query string / fragment
    const pathOnly = iri.split(/[?#]/)[0];
    // split path and ignore empty pieces
    const segments = pathOnly.split('/').filter(Boolean);
    return segments.length ? segments[segments.length - 1] : '';
}