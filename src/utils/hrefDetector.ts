export type LinkUniformProps = {
  path: string,
  type: string,
  nodeId?: string,
  projectMapId?: string,
};
export type LinkProps = LinkUniformProps | string | undefined;
export const getHref = (link: LinkProps) => {
  if (typeof link === 'object') {
    if (link?.type === 'projectMapNode' || link?.type === 'url') {
      return link?.path;
    }
    if (link?.type === 'email') {
      return `mailto:${link.path}`;
    }
    if (link?.type === 'tel') {
      return `tel:${link.path}`;
    }
  } else if (typeof link === 'string') {
    return link;
  }
  return undefined;
};

export const formatHrefWithAnchor = (link: string, anchor?: string) => (anchor && anchor.startsWith('#') ? `${link}${anchor}` : link);
