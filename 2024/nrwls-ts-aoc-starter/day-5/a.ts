import { runSolution } from '../utils.ts';

enum Order {
  Before,
  After,
}

class Rule {
  private readonly pages: [page1: number, page2: number];
  private readonly otherPageMap: { [page: number]: number };
  private readonly orderMap: { [page: number]: Order };

  private constructor(readonly page1: number, readonly page2: number) {
    this.pages = [page1, page2];
    this.otherPageMap = {
      [page1]: page2,
      [page2]: page1,
    };
    this.orderMap = {
      [page1]: Order.Before,
      [page2]: Order.After,
    };
  }

  hasPage(page: number) {
    return this.pages.includes(page);
  }

  getOtherPage(page: number) {
    return this.otherPageMap[page];
  }

  getOrder(page: number) {
    return this.orderMap[page];
  }

  static isRuleString(s: string) {
    return s.includes('|');
  }

  static fromRuleString(s: string) {
    const [page1, page2] = s.split('|').map(Number);
    return new Rule(page1, page2);
  }
}

class Update {
  private constructor(readonly pages: number[]) {}

  satisfies(rule: Rule) {
    for (const page of this.pages) {
      if (!rule.hasPage(page)) {
        continue;
      }
      const order = rule.getOrder(page);
      const otherPage = rule.getOtherPage(page);
      switch (order) {
        case Order.Before:
          if (
            this.pages.slice(0, this.pages.indexOf(page)).includes(otherPage)
          ) {
            return false;
          }
          break;
        case Order.After:
          if (
            this.pages.slice(this.pages.indexOf(page) + 1).includes(otherPage)
          ) {
            return false;
          }
      }
    }
    return true;
  }

  getMiddlePage() {
    return this.pages[Math.floor(this.pages.length / 2)];
  }

  static isUpdateString(s: string) {
    return s.includes(',');
  }

  static fromUpdateString(s: string) {
    const pages = s.split(',').map(Number);
    return new Update(pages);
  }
}

const parseData = (data: string[]) => {
  const rules: Rule[] = [];
  const updates: Update[] = [];
  for (const datum of data) {
    if (Rule.isRuleString(datum)) {
      rules.push(Rule.fromRuleString(datum));
    } else if (Update.isUpdateString(datum)) {
      updates.push(Update.fromUpdateString(datum));
    }
  }
  return { rules, updates };
};

/** provide your solution as the return of this function */
export async function day5a(data: string[]) {
  console.log(data);
  const { rules, updates } = parseData(data);
  let sum = 0;
  for (const update of updates) {
    if (rules.every((rule) => update.satisfies(rule))) {
      sum += update.getMiddlePage();
    }
  }
  return sum;
}

await runSolution(day5a);
