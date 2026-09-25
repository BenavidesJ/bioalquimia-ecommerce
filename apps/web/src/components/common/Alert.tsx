import { forwardRef, type ReactElement, type ReactNode } from "react";
import { Alert as ChakraAlert } from "@chakra-ui/react";

export interface AlertProps extends Omit<ChakraAlert.RootProps, "title"> {
  readonly startElement?: ReactNode | null;
  readonly endElement?: ReactNode | null;
  readonly title: ReactNode | null;
  readonly icon?: ReactElement | null;
}

export const AlertComponent = forwardRef<
  HTMLDivElement,
  AlertProps
>(function Alert(props, ref) {
  const { title, children, icon, startElement, endElement, status, ...rest } = props;
  return (
    <ChakraAlert.Root ref={ref} status={status} {...rest}>
      {startElement || <ChakraAlert.Indicator>{icon}</ChakraAlert.Indicator>}
      {children ? (
        <ChakraAlert.Content>
          <ChakraAlert.Title>{title}</ChakraAlert.Title>
          <ChakraAlert.Description>{children}</ChakraAlert.Description>
        </ChakraAlert.Content>
      ) : (
        <ChakraAlert.Title flex="1">{title}</ChakraAlert.Title>
      )}
      {endElement}
    </ChakraAlert.Root>
  )
});
