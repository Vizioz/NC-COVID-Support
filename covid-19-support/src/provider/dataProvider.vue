<script lang="ts">

export interface IDataProvider {
  providerType: string,
  baseUrl: string,
  getCategories(): Object[]
  getResources(category: string): Object[]
  getResource(id: number): Object
}

export class ProviderConfig {
  constructor(
    public getCategories: () => Object[],
    public getResources: (category: string) => Object[],
    public getResource: (id: number) => Object
  ) { }
}

export class DataProvider implements IDataProvider {
  
  private providerConfig: ProviderConfig
  
  public getCategories() {
    if (this.providerConfig != null && this.providerConfig.getCategories != null) {
      return this.providerConfig.getCategories();
    } else {
      return [];
    }
  }

  public getResources(category: string) {
    if (this.providerConfig != null && this.providerConfig.getResources != null) {
      return this.providerConfig.getResources(category);
    } else {
      return [];
    }
  }

  public getResource(id: number) {
    if (this.providerConfig != null && this.providerConfig.getResource != null) {
      return this.providerConfig.getResource(id);
    } else {
      return [];
    }
  }

  constructor(
    public providerType: string,
    public baseUrl: string,
    config: ProviderConfig
  ) {
    this.providerConfig = config   
  }
}

</script>