import { forwardRef } from "react";
import {
  Skeleton as ChakraSkeleton,
  SkeletonCircle as ChakraSkeletonCircle,
  SkeletonText as ChakraSkeletonText,
  type SkeletonProps,
  type SkeletonCircleProps,
  type SkeletonTextProps,
} from "@chakra-ui/react";

export const SkeletonComponent = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(props, ref) {
    return <ChakraSkeleton ref={ref} {...props} />;
  },
);

export const SkeletonTextComponent = forwardRef<
  HTMLDivElement,
  SkeletonTextProps
>(function SkeletonText(props, ref) {
  return <ChakraSkeletonText ref={ref} {...props} />;
});

export const SkeletonCircleComponent = forwardRef<
  HTMLDivElement,
  SkeletonCircleProps
>(function SkeletonCircle(props, ref) {
  return <ChakraSkeletonCircle ref={ref} {...props} />;
});
