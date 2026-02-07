import * as React from "react";
import type { IHyperSpotlightEmployee } from "../models";
import styles from "./HyperSpotlightActionButtons.module.scss";

export interface IHyperSpotlightActionButtonsProps {
  employee: IHyperSpotlightEmployee;
  enableEmail: boolean;
  enableTeams: boolean;
  enableProfile: boolean;
}

const HyperSpotlightActionButtons: React.FC<IHyperSpotlightActionButtonsProps> = function (props) {
  const emp = props.employee;

  if (!props.enableEmail && !props.enableTeams && !props.enableProfile) {
    return React.createElement(React.Fragment);
  }

  const buttons: React.ReactElement[] = [];

  if (props.enableEmail && emp.mail) {
    buttons.push(
      React.createElement(
        "button",
        {
          key: "email",
          className: styles.actionButton + " " + styles.emailButton,
          onClick: function () { window.location.href = "mailto:" + emp.mail; },
          "aria-label": "Send email to " + emp.displayName,
          title: "Send Email",
        },
        React.createElement("span", { className: styles.buttonIcon }, "📧"),
        React.createElement("span", { className: styles.buttonText }, "Email")
      )
    );
  }

  if (props.enableTeams && emp.userPrincipalName) {
    buttons.push(
      React.createElement(
        "button",
        {
          key: "teams",
          className: styles.actionButton + " " + styles.teamsButton,
          onClick: function () {
            window.open("https://teams.microsoft.com/l/chat/0/0?users=" + emp.userPrincipalName, "_blank");
          },
          "aria-label": "Chat with " + emp.displayName + " in Teams",
          title: "Chat in Teams",
        },
        React.createElement("span", { className: styles.buttonIcon }, "💬"),
        React.createElement("span", { className: styles.buttonText }, "Teams")
      )
    );
  }

  if (props.enableProfile && emp.userPrincipalName) {
    buttons.push(
      React.createElement(
        "button",
        {
          key: "profile",
          className: styles.actionButton + " " + styles.profileButton,
          onClick: function () {
            window.open("https://delve.office.com/?u=" + emp.userPrincipalName, "_blank");
          },
          "aria-label": "View " + emp.displayName + "'s profile",
          title: "View Profile",
        },
        React.createElement("span", { className: styles.buttonIcon }, "👤"),
        React.createElement("span", { className: styles.buttonText }, "Profile")
      )
    );
  }

  return React.createElement("div", { className: styles.actionButtons }, buttons);
};

export default HyperSpotlightActionButtons;
