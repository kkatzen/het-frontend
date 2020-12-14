import { Breakdowns } from "./Breakdowns";
import { JoinType } from "./datasetutils";
import { VariableId } from "./variableProviders";

class VariableQuery {
  readonly varIds: VariableId[];
  readonly breakdowns: Breakdowns;
  readonly joinType: JoinType;

  constructor(
    varIds: VariableId | VariableId[],
    breakdowns: Breakdowns,
    joinType?: JoinType
  ) {
    this.varIds = [varIds].flat();
    this.breakdowns = breakdowns;
    this.joinType = joinType || "left";
  }

  getUniqueKey(): string {
    return this.varIds.join(",") + ":____:" + this.breakdowns.getUniqueKey();
  }
}

export default VariableQuery;
