/**
 * Drop this at the top of a page component to control the document title
 * and meta description. React 19 hoists <title> and <meta> in the component
 * tree into <head>, so no imperative useEffect juggling needed.
 *
 * Usage:
 *   <PageMeta title="Duty Station Directory" description="..." path="/directory" />
 */

const SITE_NAME = "Duty Station Relocation";
const SITE_ORIGIN = "https://dutystation.us";

interface PageMetaProps {
  title: string;
  description?: string;
  // Path without origin, e.g. "/directory" or "/station/presidio-station".
  // Used to emit a canonical link + og:url.
  path?: string;
}

export function PageMeta({ title, description, path }: PageMetaProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = path ? `${SITE_ORIGIN}${path}` : undefined;

  return (
    <>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      {url ? <link rel="canonical" href={url} /> : null}
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      {url ? <meta property="og:url" content={url} /> : null}
    </>
  );
}
