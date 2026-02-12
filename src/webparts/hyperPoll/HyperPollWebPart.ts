import * as React from "react";
import * as ReactDom from "react-dom";
import { Version, DisplayMode } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  type IPropertyPaneField,
  type IPropertyPaneGroup,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneLabel,
  PropertyPaneHorizontalRule,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperPollWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import { createGroupHeaderField, createQuickActionsGroup } from "../../common/propertyPane";
import HyperPoll from "./components/HyperPoll";
import type { IHyperPollComponentProps } from "./components/HyperPoll";
import type { IHyperPollWebPartProps, IHyperPoll, IPollQuestion, IPollOption } from "./models";
import { parsePolls, stringifyPolls } from "./models";
import {
  createPoll,
  removePoll,
  reorderPoll,
  createQuestion,
  removeQuestion,
  reorderQuestion,
  createOption,
  removeOption,
} from "./utils/pollManager";

const DISPLAY_MODE_OPTIONS = [
  { key: "carousel", text: strings.DisplayModeCarousel },
  { key: "stacked", text: strings.DisplayModeStacked },
];

const CHART_TYPE_OPTIONS = [
  { key: "bar", text: strings.ChartTypeBar },
  { key: "pie", text: strings.ChartTypePie },
  { key: "donut", text: strings.ChartTypeDonut },
];

const STATUS_OPTIONS = [
  { key: "draft", text: strings.StatusDraft },
  { key: "active", text: strings.StatusActive },
  { key: "closed", text: strings.StatusClosed },
  { key: "archived", text: strings.StatusArchived },
];

const RESULTS_VISIBILITY_OPTIONS = [
  { key: "afterVote", text: strings.VisibilityAfterVote },
  { key: "afterClose", text: strings.VisibilityAfterClose },
  { key: "adminOnly", text: strings.VisibilityAdminOnly },
];

const QUESTION_TYPE_OPTIONS = [
  { key: "singleChoice", text: strings.TypeSingleChoice },
  { key: "multipleChoice", text: strings.TypeMultipleChoice },
  { key: "rating", text: strings.TypeRating },
  { key: "nps", text: strings.TypeNps },
  { key: "ranking", text: strings.TypeRanking },
  { key: "openText", text: strings.TypeOpenText },
];

const TEMPLATE_OPTIONS = [
  { key: "", text: strings.ApplyTemplateNone },
  { key: "nps-survey", text: strings.TemplateNpsSurvey },
  { key: "event-feedback", text: strings.TemplateEventFeedback },
  { key: "quick-pulse", text: strings.TemplateQuickPulse },
];

export default class HyperPollWebPart extends BaseHyperWebPart<IHyperPollWebPartProps> {

  public render(): void {
    var self = this;
    const componentProps: IHyperPollComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onConfigure: (): void => { self.context.propertyPane.open(); },
      onWizardComplete: function (): void {
        self.properties.wizardCompleted = true;
        self.render();
      },
      onWizardApply: function (result: Partial<IHyperPollWebPartProps>): void {
        var keys = Object.keys(result);
        keys.forEach(function (key) {
          (self.properties as unknown as Record<string, unknown>)[key] =
            (result as unknown as Record<string, unknown>)[key];
        });
        self.properties.wizardCompleted = true;
        self.render();
        self.context.propertyPane.refresh();
      },
    };
    const element: React.ReactElement<IHyperPollComponentProps> =
      React.createElement(HyperPoll, componentProps);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "Poll";
    }
    if (this.properties.polls === undefined) {
      this.properties.polls = "[]";
    }
    if (this.properties.responseListName === undefined) {
      this.properties.responseListName = "";
    }
    if (this.properties.displayMode === undefined) {
      this.properties.displayMode = "stacked";
    }
    if (this.properties.defaultChartType === undefined) {
      this.properties.defaultChartType = "bar";
    }
    if (this.properties.showInlineResults === undefined) {
      this.properties.showInlineResults = true;
    }
    if (this.properties.enableExport === undefined) {
      this.properties.enableExport = false;
    }
    if (this.properties.refreshInterval === undefined) {
      this.properties.refreshInterval = 0;
    }
    if (this.properties.cacheDuration === undefined) {
      this.properties.cacheDuration = 300;
    }
    if (this.properties.showWizardOnInit === undefined) {
      this.properties.showWizardOnInit = true;
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = true;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = false;
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  // ── Poll data helpers ──

  private _updatePolls(polls: IHyperPoll[]): void {
    this.properties.polls = stringifyPolls(polls);
    this.render();
    this.context.propertyPane.refresh();
  }

  // ── Poll-level handlers ──

  private _createPollAddHandler(): () => string {
    return (): string => {
      const polls = parsePolls(this.properties.polls);
      // Don't include the default poll on first add if it's the placeholder
      const existing = polls.length === 1 && polls[0].id === "poll-default" ? [] : polls;
      const newPoll = createPoll("Poll " + (existing.length + 1));
      existing.push(newPoll);
      this._updatePolls(existing);
      return "";
    };
  }

  private _createPollRemoveHandler(pollId: string): () => string {
    return (): string => {
      const polls = parsePolls(this.properties.polls);
      const updated = removePoll(polls, pollId);
      this._updatePolls(updated.length > 0 ? updated : []);
      return "";
    };
  }

  private _createPollMoveHandler(fromIndex: number, toIndex: number): () => string {
    return (): string => {
      const polls = parsePolls(this.properties.polls);
      const reordered = reorderPoll(polls, fromIndex, toIndex);
      this._updatePolls(reordered);
      return "";
    };
  }

  // ── Question-level handlers ──

  private _createQuestionAddHandler(pollIndex: number): () => string {
    return (): string => {
      const polls = parsePolls(this.properties.polls);
      if (pollIndex >= 0 && pollIndex < polls.length) {
        const newQ = createQuestion("Question " + (polls[pollIndex].questions.length + 1));
        polls[pollIndex].questions.push(newQ);
        this._updatePolls(polls);
      }
      return "";
    };
  }

  private _createQuestionRemoveHandler(pollIndex: number, questionId: string): () => string {
    return (): string => {
      const polls = parsePolls(this.properties.polls);
      if (pollIndex >= 0 && pollIndex < polls.length) {
        polls[pollIndex].questions = removeQuestion(polls[pollIndex].questions, questionId);
        this._updatePolls(polls);
      }
      return "";
    };
  }

  private _createQuestionMoveHandler(pollIndex: number, fromIndex: number, toIndex: number): () => string {
    return (): string => {
      const polls = parsePolls(this.properties.polls);
      if (pollIndex >= 0 && pollIndex < polls.length) {
        polls[pollIndex].questions = reorderQuestion(polls[pollIndex].questions, fromIndex, toIndex);
        this._updatePolls(polls);
      }
      return "";
    };
  }

  // ── Option-level handlers ──

  private _createOptionAddHandler(pollIndex: number, questionIndex: number): () => string {
    return (): string => {
      const polls = parsePolls(this.properties.polls);
      if (pollIndex >= 0 && pollIndex < polls.length) {
        const q = polls[pollIndex].questions;
        if (questionIndex >= 0 && questionIndex < q.length) {
          const newOpt = createOption("Option " + (q[questionIndex].options.length + 1));
          q[questionIndex].options.push(newOpt);
          this._updatePolls(polls);
        }
      }
      return "";
    };
  }

  private _createOptionRemoveHandler(pollIndex: number, questionIndex: number, optionId: string): () => string {
    return (): string => {
      const polls = parsePolls(this.properties.polls);
      if (pollIndex >= 0 && pollIndex < polls.length) {
        const q = polls[pollIndex].questions;
        if (questionIndex >= 0 && questionIndex < q.length) {
          q[questionIndex].options = removeOption(q[questionIndex].options, optionId);
          this._updatePolls(polls);
        }
      }
      return "";
    };
  }

  // ── Build option fields for a single question ──

  private _buildOptionFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: IPropertyPaneField<any>[],
    options: IPollOption[],
    pollIndex: number,
    questionIndex: number
  ): void {
    for (let oi = 0; oi < options.length; oi++) {
      const opt = options[oi];
      const prefix = "_o" + pollIndex + "_" + questionIndex + "_" + oi;

      fields.push(
        PropertyPaneTextField(prefix + "Text", {
          label: strings.OptionHeaderPrefix + " " + (oi + 1),
          value: opt.text,
        })
      );

      fields.push(
        PropertyPaneTextField(prefix + "Color", {
          label: strings.OptionColorLabel,
          value: opt.color || "",
          description: "Hex color (optional)",
        })
      );

      fields.push(
        PropertyPaneButton(prefix + "Remove", {
          text: strings.RemoveOptionLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "Delete",
          onClick: this._createOptionRemoveHandler(pollIndex, questionIndex, opt.id),
        })
      );
    }

    fields.push(
      PropertyPaneButton("_oAdd" + pollIndex + "_" + questionIndex, {
        text: strings.AddOptionLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Add",
        onClick: this._createOptionAddHandler(pollIndex, questionIndex),
      })
    );
  }

  // ── Build question fields for a single poll ──

  private _buildQuestionFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: IPropertyPaneField<any>[],
    questions: IPollQuestion[],
    pollIndex: number
  ): void {
    for (let qi = 0; qi < questions.length; qi++) {
      const q = questions[qi];
      const qPrefix = "_q" + pollIndex + "_" + qi;

      fields.push(
        PropertyPaneLabel(qPrefix + "Label", {
          text: strings.QuestionHeaderPrefix + " " + (qi + 1) + ": " + q.text,
        })
      );

      fields.push(
        PropertyPaneTextField(qPrefix + "Text", {
          label: strings.QuestionTextLabel,
          value: q.text,
        })
      );

      fields.push(
        PropertyPaneDropdown(qPrefix + "Type", {
          label: strings.QuestionTypeLabel,
          options: QUESTION_TYPE_OPTIONS,
          selectedKey: q.type,
        })
      );

      fields.push(
        PropertyPaneToggle(qPrefix + "Required", {
          label: strings.QuestionRequiredLabel,
          checked: q.isRequired,
        })
      );

      // Rating max for rating type
      if (q.type === "rating") {
        fields.push(
          PropertyPaneSlider(qPrefix + "RatingMax", {
            label: strings.QuestionRatingMaxLabel,
            min: 3,
            max: 10,
            value: q.ratingMax,
          })
        );
      }

      // Options — only for choice/ranking types
      if (q.type === "singleChoice" || q.type === "multipleChoice" || q.type === "ranking") {
        this._buildOptionFields(fields, q.options, pollIndex, qi);
      }

      // Move Up/Down/Remove for question
      fields.push(
        PropertyPaneButton(qPrefix + "MoveUp", {
          text: strings.MoveUpLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "ChevronUp",
          disabled: qi === 0,
          onClick: this._createQuestionMoveHandler(pollIndex, qi, qi - 1),
        })
      );

      fields.push(
        PropertyPaneButton(qPrefix + "MoveDown", {
          text: strings.MoveDownLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "ChevronDown",
          disabled: qi === questions.length - 1,
          onClick: this._createQuestionMoveHandler(pollIndex, qi, qi + 1),
        })
      );

      fields.push(
        PropertyPaneButton(qPrefix + "Remove", {
          text: strings.RemoveQuestionLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "Delete",
          onClick: this._createQuestionRemoveHandler(pollIndex, q.id),
        })
      );

      fields.push(PropertyPaneHorizontalRule());
    }

    fields.push(
      PropertyPaneButton("_qAdd" + pollIndex, {
        text: strings.AddQuestionLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Add",
        onClick: this._createQuestionAddHandler(pollIndex),
      })
    );
  }

  // ── Build all poll management fields ──

  private _buildPollManagementFields(): IPropertyPaneField<unknown>[] {
    const polls = parsePolls(this.properties.polls);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: IPropertyPaneField<any>[] = [];

    for (let pi = 0; pi < polls.length; pi++) {
      const poll = polls[pi];
      const pPrefix = "_p" + pi;

      fields.push(
        PropertyPaneLabel(pPrefix + "Label", {
          text: strings.PollHeaderPrefix + " " + (pi + 1) + ": " + poll.title,
        })
      );

      fields.push(
        PropertyPaneTextField(pPrefix + "Title", {
          label: strings.PollTitleLabel,
          value: poll.title,
        })
      );

      fields.push(
        PropertyPaneTextField(pPrefix + "Description", {
          label: strings.PollDescriptionLabel,
          value: poll.description,
          multiline: true,
        })
      );

      fields.push(
        PropertyPaneDropdown(pPrefix + "Status", {
          label: strings.PollStatusLabel,
          options: STATUS_OPTIONS,
          selectedKey: poll.status,
        })
      );

      fields.push(
        PropertyPaneToggle(pPrefix + "Anonymous", {
          label: strings.PollAnonymousLabel,
          checked: poll.isAnonymous,
        })
      );

      fields.push(
        PropertyPaneDropdown(pPrefix + "Visibility", {
          label: strings.PollResultsVisibilityLabel,
          options: RESULTS_VISIBILITY_OPTIONS,
          selectedKey: poll.resultsVisibility,
        })
      );

      fields.push(
        PropertyPaneTextField(pPrefix + "StartDate", {
          label: strings.PollStartDateLabel,
          value: poll.startDate || "",
          description: "e.g. 2025-06-01T00:00:00Z",
        })
      );

      fields.push(
        PropertyPaneTextField(pPrefix + "EndDate", {
          label: strings.PollEndDateLabel,
          value: poll.endDate || "",
          description: "e.g. 2025-06-30T23:59:59Z",
        })
      );

      // Questions for this poll
      this._buildQuestionFields(fields, poll.questions, pi);

      // Poll-level Move/Remove
      fields.push(
        PropertyPaneButton(pPrefix + "MoveUp", {
          text: strings.MoveUpLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "ChevronUp",
          disabled: pi === 0,
          onClick: this._createPollMoveHandler(pi, pi - 1),
        })
      );

      fields.push(
        PropertyPaneButton(pPrefix + "MoveDown", {
          text: strings.MoveDownLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "ChevronDown",
          disabled: pi === polls.length - 1,
          onClick: this._createPollMoveHandler(pi, pi + 1),
        })
      );

      fields.push(
        PropertyPaneButton(pPrefix + "Remove", {
          text: strings.RemovePollLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "Delete",
          onClick: this._createPollRemoveHandler(poll.id),
        })
      );

      fields.push(PropertyPaneHorizontalRule());
    }

    fields.push(
      PropertyPaneButton("_pAdd", {
        text: strings.AddPollLabel,
        buttonType: PropertyPaneButtonType.Primary,
        icon: "Add",
        onClick: this._createPollAddHandler(),
      })
    );

    return fields;
  }

  // ── Property pane field change handling ──

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: unknown,
    newValue: unknown
  ): void {
    // ── Poll-level field changes (_p{index}{Field}) ──
    if (propertyPath.indexOf("_p") === 0 && propertyPath.indexOf("_q") === -1 && propertyPath.indexOf("_o") === -1) {
      this._handlePollFieldChange(propertyPath, newValue);
      return;
    }

    // ── Question-level field changes (_q{pollIndex}_{questionIndex}{Field}) ──
    if (propertyPath.indexOf("_q") === 0 && propertyPath.indexOf("_o") === -1) {
      this._handleQuestionFieldChange(propertyPath, newValue);
      return;
    }

    // ── Option-level field changes (_o{pollIndex}_{questionIndex}_{optionIndex}{Field}) ──
    if (propertyPath.indexOf("_o") === 0) {
      this._handleOptionFieldChange(propertyPath, newValue);
      return;
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  private _handlePollFieldChange(propertyPath: string, newValue: unknown): void {
    // Extract poll index: _p{index}{FieldName}
    const afterP = propertyPath.substring(2); // remove "_p"
    const fieldNames = ["Title", "Description", "Status", "Anonymous", "Visibility", "StartDate", "EndDate", "Label"];
    let fieldName = "";
    let indexStr = "";

    for (let fi = 0; fi < fieldNames.length; fi++) {
      const fn = fieldNames[fi];
      const fnPos = afterP.indexOf(fn);
      if (fnPos !== -1) {
        indexStr = afterP.substring(0, fnPos);
        fieldName = fn;
        break;
      }
    }

    if (!fieldName) return;
    const pollIndex = parseInt(indexStr, 10);
    if (isNaN(pollIndex)) return;

    const polls = parsePolls(this.properties.polls);
    if (pollIndex < 0 || pollIndex >= polls.length) return;

    if (fieldName === "Title") {
      polls[pollIndex].title = String(newValue);
    } else if (fieldName === "Description") {
      polls[pollIndex].description = String(newValue);
    } else if (fieldName === "Status") {
      polls[pollIndex].status = String(newValue) as IHyperPoll["status"];
    } else if (fieldName === "Anonymous") {
      polls[pollIndex].isAnonymous = !!newValue;
    } else if (fieldName === "Visibility") {
      polls[pollIndex].resultsVisibility = String(newValue) as IHyperPoll["resultsVisibility"];
    } else if (fieldName === "StartDate") {
      polls[pollIndex].startDate = String(newValue) || undefined;
    } else if (fieldName === "EndDate") {
      polls[pollIndex].endDate = String(newValue) || undefined;
    } else {
      return;
    }

    this._updatePolls(polls);
  }

  private _handleQuestionFieldChange(propertyPath: string, newValue: unknown): void {
    // Format: _q{pollIndex}_{questionIndex}{FieldName}
    const afterQ = propertyPath.substring(2); // remove "_q"
    const underscorePos = afterQ.indexOf("_");
    if (underscorePos === -1) return;

    const pollIndex = parseInt(afterQ.substring(0, underscorePos), 10);
    if (isNaN(pollIndex)) return;

    const rest = afterQ.substring(underscorePos + 1);
    const fieldNames = ["Text", "Type", "Required", "RatingMax", "Label"];
    let fieldName = "";
    let qIndexStr = "";

    for (let fi = 0; fi < fieldNames.length; fi++) {
      const fn = fieldNames[fi];
      const fnPos = rest.indexOf(fn);
      if (fnPos !== -1) {
        qIndexStr = rest.substring(0, fnPos);
        fieldName = fn;
        break;
      }
    }

    if (!fieldName) return;
    const questionIndex = parseInt(qIndexStr, 10);
    if (isNaN(questionIndex)) return;

    const polls = parsePolls(this.properties.polls);
    if (pollIndex < 0 || pollIndex >= polls.length) return;
    const questions = polls[pollIndex].questions;
    if (questionIndex < 0 || questionIndex >= questions.length) return;

    if (fieldName === "Text") {
      questions[questionIndex].text = String(newValue);
    } else if (fieldName === "Type") {
      questions[questionIndex].type = String(newValue) as IPollQuestion["type"];
    } else if (fieldName === "Required") {
      questions[questionIndex].isRequired = !!newValue;
    } else if (fieldName === "RatingMax") {
      questions[questionIndex].ratingMax = Number(newValue) || 5;
    } else {
      return;
    }

    this._updatePolls(polls);
  }

  private _handleOptionFieldChange(propertyPath: string, newValue: unknown): void {
    // Format: _o{pollIndex}_{questionIndex}_{optionIndex}{FieldName}
    const afterO = propertyPath.substring(2); // remove "_o"
    const parts = afterO.split("_");
    if (parts.length < 3) return;

    const pollIndex = parseInt(parts[0], 10);
    const questionIndex = parseInt(parts[1], 10);
    if (isNaN(pollIndex) || isNaN(questionIndex)) return;

    // Last part: {optionIndex}{FieldName}
    const lastPart = parts[2];
    const fieldNames = ["Text", "Color"];
    let fieldName = "";
    let oIndexStr = "";

    for (let fi = 0; fi < fieldNames.length; fi++) {
      const fn = fieldNames[fi];
      const fnPos = lastPart.indexOf(fn);
      if (fnPos !== -1) {
        oIndexStr = lastPart.substring(0, fnPos);
        fieldName = fn;
        break;
      }
    }

    if (!fieldName) return;
    const optionIndex = parseInt(oIndexStr, 10);
    if (isNaN(optionIndex)) return;

    const polls = parsePolls(this.properties.polls);
    if (pollIndex < 0 || pollIndex >= polls.length) return;
    const questions = polls[pollIndex].questions;
    if (questionIndex < 0 || questionIndex >= questions.length) return;
    const options = questions[questionIndex].options;
    if (optionIndex < 0 || optionIndex >= options.length) return;

    if (fieldName === "Text") {
      options[optionIndex].text = String(newValue);
    } else if (fieldName === "Color") {
      options[optionIndex].color = String(newValue) || undefined;
    } else {
      return;
    }

    this._updatePolls(polls);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // Build dynamic poll management group
    const pollManagementGroup: IPropertyPaneGroup = {
      groupName: strings.PollManagementGroupName,
      groupFields: ([createGroupHeaderField("_pollMgmtHeader", { icon: "\uD83D\uDCCB", title: "Polls", subtitle: "Questions & options", color: "green" })] as IPropertyPaneField<never>[]).concat(this._buildPollManagementFields() as IPropertyPaneField<never>[]),
    };

    return {
      pages: [
        // ── Page 1: General ──
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            createQuickActionsGroup({
              onReopenWizard: this._handleReopenWizard.bind(this),
              onEditInEditor: this._handleEditInEditor.bind(this),
              onToggleDemoMode: this._handleToggleDemoMode.bind(this),
            }),
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                createGroupHeaderField("_generalHeader", { icon: "\uD83C\uDFA8", title: "General", subtitle: "Display & charts", color: "blue" }),
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("displayMode", {
                  label: strings.DisplayModeFieldLabel,
                  options: DISPLAY_MODE_OPTIONS,
                }),
                PropertyPaneDropdown("defaultChartType", {
                  label: strings.DefaultChartTypeFieldLabel,
                  options: CHART_TYPE_OPTIONS,
                }),
                PropertyPaneToggle("showInlineResults", {
                  label: strings.ShowInlineResultsLabel,
                }),
                PropertyPaneDropdown("_applyTemplate", {
                  label: strings.ApplyTemplateLabel,
                  options: TEMPLATE_OPTIONS,
                  selectedKey: "",
                }),
              ],
            },
          ],
        },
        // ── Page 2: Features ──
        {
          header: { description: strings.FeaturesPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                createGroupHeaderField("_featuresHeader", { icon: "\u2699\uFE0F", title: "Features", subtitle: "Export & refresh", color: "orange" }),
                PropertyPaneToggle("enableExport", {
                  label: strings.EnableExportLabel,
                }),
                PropertyPaneSlider("refreshInterval", {
                  label: strings.RefreshIntervalFieldLabel,
                  min: 0,
                  max: 300,
                  step: 15,
                }),
                PropertyPaneSlider("cacheDuration", {
                  label: strings.CacheDurationFieldLabel,
                  min: 0,
                  max: 3600,
                  step: 60,
                }),
                PropertyPaneTextField("responseListName", {
                  label: strings.ResponseListNameLabel,
                }),
              ],
            },
            {
              groupName: strings.WizardGroupName,
              groupFields: [
                createGroupHeaderField("_wizardHeader", { icon: "\u2699\uFE0F", title: "Setup", subtitle: "Wizard & demo", color: "orange" }),
                PropertyPaneToggle("showWizardOnInit", {
                  label: strings.ShowWizardOnInitLabel,
                }),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataLabel,
                }),
              ],
            },
          ],
        },
        // ── Page 3: Poll Management ──
        {
          header: { description: strings.DataPageDescription },
          groups: [pollManagementGroup],
        },
      ],
    };
  }
}
