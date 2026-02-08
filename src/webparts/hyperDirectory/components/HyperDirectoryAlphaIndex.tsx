import * as React from "react";
import { ALPHABET_LETTERS } from "../models";
import { getLetterForUser } from "../utils/userMapper";
import type { IHyperDirectoryUser } from "../models";
import styles from "./HyperDirectoryAlphaIndex.module.scss";

export interface IHyperDirectoryAlphaIndexProps {
  users: IHyperDirectoryUser[];
  activeLetter: string;
  onLetterClick: (letter: string) => void;
}

const HyperDirectoryAlphaIndex: React.FC<IHyperDirectoryAlphaIndexProps> = function (props) {
  const { users, activeLetter, onLetterClick } = props;

  // Calculate which letters have users
  const availableLetters = React.useMemo(function (): Record<string, boolean> {
    const letterMap: Record<string, boolean> = {};
    users.forEach(function (user) {
      const letter = getLetterForUser(user);
      letterMap[letter] = true;
    });
    return letterMap;
  }, [users]);

  const buttons = ALPHABET_LETTERS.map(function (letter) {
    const isActive = activeLetter === letter;
    const hasUsers = availableLetters[letter] === true;

    let className = styles.letterButton;
    if (isActive) {
      className += " " + styles.active;
    } else if (!hasUsers) {
      className += " " + styles.disabled;
    }

    return React.createElement("button", {
      key: letter,
      type: "button",
      className: className,
      onClick: hasUsers ? function () { onLetterClick(letter); } : undefined,
      "aria-label": "Filter by letter " + letter,
      "aria-pressed": isActive ? "true" : "false",
      disabled: !hasUsers && !isActive,
    }, letter);
  });

  return React.createElement("nav", {
    className: styles.alphaIndex,
    role: "navigation",
    "aria-label": "Alphabetical index",
  }, buttons);
};

export default React.memo(HyperDirectoryAlphaIndex);
