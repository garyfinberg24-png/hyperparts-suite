import { useState, useCallback } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import type { IWizardListConfig } from "../models/IHyperPollWizardState";

// ============================================================
// SP List Auto-Provisioning Hook
// Creates HyperPoll Responses + Leaderboard lists if needed
// ============================================================

export interface IProvisioningStatus {
  /** Whether provisioning is in progress */
  provisioning: boolean;
  /** Whether responses list exists */
  responsesListReady: boolean;
  /** Whether leaderboard list exists */
  leaderboardListReady: boolean;
  /** Error message (empty = no error) */
  error: string;
}

export interface IUseListProvisioningResult {
  status: IProvisioningStatus;
  /** Provision lists according to config */
  provisionLists: (config: IWizardListConfig) => Promise<boolean>;
  /** Check if a named list exists */
  checkListExists: (listName: string) => Promise<boolean>;
}

/** Check if a SP list exists by title */
async function listExists(listName: string): Promise<boolean> {
  if (!listName) return false;
  try {
    var sp = getSP();
    await sp.web.lists.getByTitle(listName).select("Title")();
    return true;
  } catch {
    return false;
  }
}

/** Create the Responses list with required columns */
async function createResponsesList(listName: string): Promise<void> {
  var sp = getSP();
  // Create generic list (template 100)
  await sp.web.lists.add(listName, "HyperPoll survey responses", 100, false);

  var list = sp.web.lists.getByTitle(listName);

  // Add columns — Title is used for PollId
  await list.fields.addText("QuestionId", { MaxLength: 255 });
  await list.fields.addText("UserId", { MaxLength: 255 });
  await list.fields.addText("UserEmail", { MaxLength: 255 });
  await list.fields.addMultilineText("ResponseData", {
    NumberOfLines: 6,
    RichText: false,
    AppendOnly: false,
  });
  await list.fields.addDateTime("Timestamp");
  await list.fields.addBoolean("IsAnonymous");
}

/** Create the Leaderboard list with required columns */
async function createLeaderboardList(listName: string): Promise<void> {
  var sp = getSP();
  // Create generic list (template 100)
  await sp.web.lists.add(listName, "HyperPoll quiz leaderboard", 100, false);

  var list = sp.web.lists.getByTitle(listName);

  // Add columns — Title is used for DisplayName
  await list.fields.addText("UserId", { MaxLength: 255 });
  await list.fields.addText("UserEmail", { MaxLength: 255 });
  await list.fields.addNumber("TotalPoints");
  await list.fields.addNumber("QuizzesTaken");
  await list.fields.addNumber("CorrectAnswers");
  await list.fields.addNumber("CurrentStreak");
  await list.fields.addText("Badges", { MaxLength: 255 });
}

export function useListProvisioning(): IUseListProvisioningResult {
  var statusState = useState<IProvisioningStatus>({
    provisioning: false,
    responsesListReady: false,
    leaderboardListReady: false,
    error: "",
  });
  var status = statusState[0];
  var setStatus = statusState[1];

  var checkListExists = useCallback(async function (listName: string): Promise<boolean> {
    return listExists(listName);
  }, []);

  var provisionLists = useCallback(async function (config: IWizardListConfig): Promise<boolean> {
    setStatus({
      provisioning: true,
      responsesListReady: false,
      leaderboardListReady: false,
      error: "",
    });

    try {
      var responsesReady = false;
      var leaderboardReady = false;

      // Provision Responses list
      if (config.provisionResponsesList && config.responsesListName) {
        var exists = await listExists(config.responsesListName);
        if (!exists) {
          await createResponsesList(config.responsesListName);
        }
        responsesReady = true;
      }

      // Provision Leaderboard list
      if (config.provisionLeaderboardList && config.leaderboardListName) {
        var lbExists = await listExists(config.leaderboardListName);
        if (!lbExists) {
          await createLeaderboardList(config.leaderboardListName);
        }
        leaderboardReady = true;
      }

      setStatus({
        provisioning: false,
        responsesListReady: responsesReady,
        leaderboardListReady: leaderboardReady,
        error: "",
      });

      return true;
    } catch (e) {
      var msg = e instanceof Error ? e.message : String(e);
      setStatus({
        provisioning: false,
        responsesListReady: false,
        leaderboardListReady: false,
        error: msg,
      });
      return false;
    }
  }, []);

  return {
    status: status,
    provisionLists: provisionLists,
    checkListExists: checkListExists,
  };
}
