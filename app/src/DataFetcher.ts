// Note: this Will be replaced with real API calls. Leaving data fetches
// untyped for now, but we should define types for the API calls once we
// establish the API types.

class DataFetcher {
  private async loadData(url: string) {
    const r = await fetch(url);
    return await r.json();
  }

  private getUrl(datasetId: string) {
    if (datasetId === "state_names") {
      return "https://api.census.gov/data/2010/dec/sf1?get=NAME&for=state:*";
    } else if (datasetId === "county_names") {
      return "https://api.census.gov/data/2010/dec/sf1?get=NAME&for=county:*&in=state:*";
    } else if (datasetId === "pop_by_race") {
      return (
        "https://api.census.gov/data/2018/acs/acs5/profile" +
        "?get=NAME,DP05_0070E,DP05_0071E,DP05_0077E,DP05_0078E,DP05_0080E" +
        "&for=county:*&in=state:*"
      );
    }
    throw new Error("Unknown dataset");
  }

  private convertJson(data: any) {
    let realData = data;
    const headers = realData[0];
    realData = realData.slice(1);
    realData = realData.map((row: Array<any>) => {
      const newRow: { [key: string]: any } = {};
      for (let i = 0; i < headers.length; i++) {
        newRow[headers[i]] = row[i];
      }
      return newRow;
    });
    const realHeaders = headers.map((col: string) => ({
      Header: col,
      accessor: col,
    }));
    return { columns: realHeaders, data: realData };
  }

  async loadDataset(datasetId: string) {
    const url = this.getUrl(datasetId);
    const data = await this.loadData(url);
    return this.convertJson(data);
  }
}

export default DataFetcher;
