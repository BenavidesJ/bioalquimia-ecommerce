import { Fragment, forwardRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb as ChakraBreadcrumb } from "@chakra-ui/react";

export interface BreadcrumbItem {
  readonly label: ReactNode;
  readonly href?: string;
  readonly icon?: ReactNode;
}

export interface BreadcrumbProps
  extends Omit<ChakraBreadcrumb.RootProps, "children"> {
  readonly items: readonly BreadcrumbItem[];
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb(props, ref) {
    const { items, ...rest } = props;
    return (
      <ChakraBreadcrumb.Root ref={ref} aria-label="Breadcrumb" {...rest}>
        <ChakraBreadcrumb.List>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const content = (
              <>
                {item.icon}
                {item.label}
              </>
            );
            return (
              <Fragment key={item.href ?? index}>
                {index > 0 && <ChakraBreadcrumb.Separator />}
                <ChakraBreadcrumb.Item>
                  {item.href ? (
                    <ChakraBreadcrumb.Link asChild>
                      <Link to={item.href}>{content}</Link>
                    </ChakraBreadcrumb.Link>
                  ) : isLast ? (
                    <ChakraBreadcrumb.CurrentLink
                      display={item.icon ? "inline-flex" : undefined}
                      alignItems={item.icon ? "center" : undefined}
                      gap={item.icon ? "2" : undefined}
                    >
                      {content}
                    </ChakraBreadcrumb.CurrentLink>
                  ) : (
                    <ChakraBreadcrumb.Link as="span">
                      {content}
                    </ChakraBreadcrumb.Link>
                  )}
                </ChakraBreadcrumb.Item>
              </Fragment>
            );
          })}
        </ChakraBreadcrumb.List>
      </ChakraBreadcrumb.Root>
    );
  },
);
