import { Flex, type FlexProps } from "@aws-amplify/ui-react";
import { forwardRef, type ReactNode } from "react";
import * as styles from "./NavAsideItem.css.js";

interface NavAsideItemProps extends FlexProps {
  icon: ReactNode;
  label: ReactNode;
}
/**
 * @deprecated
 */
export const NavAsideItem = forwardRef<HTMLDivElement, NavAsideItemProps>(
  function NavAsideItem(props, ref) {
    const { icon, label, ...restProps } = props;
    return (
      <Flex className={styles.itemContainer} ref={ref} {...restProps}>
        {icon}
        <div className={styles.labelContainer}>{label}</div>
      </Flex>
    );
  }
);
