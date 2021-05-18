import { Component, OnInit, ViewChild } from '@angular/core';
import { DropDownListComponent, MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  campaignsURL = "https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public"
  campaigns: any;
  logoBaseURL = "https://www.mweb.co.za/media/images/providers";
  baseURL = "https://apigw.mweb.co.za/prod/baas/proxy";
  providerInfo = [
    {
      code: 'centurycity',
      name: 'Century City Connect',
      url: `${this.logoBaseURL}/provider-century.png`
    },
    {
      code: 'evotel',
      name: 'Evotel',
      url: `${this.logoBaseURL}/provider-evotel.png`
    },
    {
      code: 'octotel',
      name: 'Octotel',
      url: `${this.logoBaseURL}/provider-octotel.png`
    },
    {
      code: 'vumatel',
      name: 'Vumatel',
      url: `${this.logoBaseURL}/provider-vuma.png`
    },
    {
      code: 'openserve',
      name: 'Openserve',
      url: `${this.logoBaseURL}/provider-openserve.png`
    },
    {
      code: 'frogfoot',
      name: 'Frogfoot',
      url: `${this.logoBaseURL}/provider-frogfoot.png`
    },
    {
      code: 'mfn',
      name: 'MFN',
      url: `${this.logoBaseURL}/provider-metrofibre.png`
    },
    {
      code: 'vodacom',
      name: 'Vodacom',
      url: `${this.logoBaseURL}/provider-vodacom.png`
    },
    {
      code: 'linkafrica',
      name: 'Link Africa',
      url: `${this.logoBaseURL}/provider-linkafrica.png`
    },
    {
      code: 'linklayer',
      name: 'Link Layer',
      url: `${this.logoBaseURL}/provider-link-layer.png`
    },
    {
      code: 'lightstruck',
      name: 'Lightstruck',
      url: `${this.logoBaseURL}/provider-lightstruck.png`
    },
    {
      code: 'mitchells',
      name: 'Mitchells Fibre',
      url: `${this.logoBaseURL}/provider-mitchells.png`
    },
    {
      code: 'vumareach',
      name: 'Vuma Reach',
      url: `${this.logoBaseURL}/provider-vuma.png`
    }
  ];
  @ViewChild('filterBy', { static: true }) public listObj: DropDownListComponent;
  @ViewChild('checkbox', { static: true }) public mulObj: MultiSelectComponent;
  filterData = [{min: 0, max: 25, label: '0 - 25 Mbps'}, {min: 25, max: 50, label: '25 - 50 Mbps'}, {min: 50, max: 100, label: '50 - 100 Mbps'}, {min: 100, max: 10000, label: '100 Mbps+'}];
  height: string = '220px';
  fields: Object = { text: 'label', value: 'label' };
  priceRanges = [{min: 0, max: 699, label: 'R0 - R699'}, {min: 700, max: 999, label: 'R700 - R999'}, {min: 1000, max: 9999, label: 'R1000+'}];
  mode: string;
  buttonTxt: string;
  selectedIndex = 0;
  selectedCampaign: any;
  promocodes: any;
  promcodeProductsURL: any;
  promocodeProducts: any = [];
  selectedProviders: any;
  // filterByPriceRanges: any;
  selectedPriceRangeLabels: any;

  constructor() { }

  ngOnInit(): void {
    this.mode = 'CheckBox';
    this.GetCampaigns();
  }

  GetCampaigns(): void{
    fetch(this.campaignsURL).then((response) => response.json()).then((data) => {
      this.campaigns = data.campaigns;
      if(this.campaigns.length > 0){
        this.buttonTxt = this.campaigns[0].name;
        this.selectedCampaign = this.campaigns[0];
        this.promocodes = this.campaigns[0].promocodes;
        this.selectedIndex = 0;
        this.FormatURL();
      }
    });
  }

  OnClick(): void{
    if(this.selectedIndex == 0){
      this.selectedIndex = 1;
    }else{
      this.selectedIndex = 0;
    }
    this.buttonTxt = this.campaigns[this.selectedIndex].name;
    this.selectedCampaign = this.campaigns[this.selectedIndex];
    this.promocodes = this.campaigns[this.selectedIndex].promocodes;
    this.FormatURL();
  }

  FormatURL(): void{
    this.promcodeProductsURL = `${this.baseURL}/marketing/products/promos/${this.promocodes.join(
      ','
    )}?sellable_online=true`;
    this.GetProductsByURL();
  }

  GetProductsByURL(): void{
     fetch(this.promcodeProductsURL).then(response => response.json().then(data => {
      this.promocodeProducts = data;
      console.log(this.promocodeProducts)
    }));
  }

  getSummarizedProduct = ({productCode, productName, productRate, subcategory}) => {
    const provider = subcategory.replace('Uncapped', '').replace('Capped', '').trim()
    return {productCode, productName, productRate, provider}
  }

  getProductsFromPromo = (pc) => {
    const promoCode = pc.promoCode
    return pc.products.reduce((prods, p) => [prods, this.getSummarizedProduct(p)], [])
  }

  summarizedProducts = this.promocodeProducts.reduce((prods, pc) => [prods, this.getProductsFromPromo(pc)], []);

  providers = [new Set(this.summarizedProducts.map(p => p.provider))];

  // selectedProducts = () => {
  //   const selectedProviderSet = new Set(this.selectedProviders)
  //   let selectedProducts = this.summarizedProducts.filter(p => selectedProviderSet.has(p.provider))
    
  //   // filter products by price range
  //   selectedProducts = selectedProducts.filter(this.filterByPriceRanges)
    
  //   // sort by price from lowest to highest
  //   selectedProducts = selectedProducts.sort((pa, pb) => pa.productRate - pb.productRate)
    
  //   return selectedProducts
  // }

  //selectedPriceRanges = this.priceRanges.filter(range => this.selectedPriceRangeLabels.includes(range.label));

  // filterByPriceRanges = (product) => {
  //   // If no price range has been selected then include all products
  //   if (this.selectedPriceRanges.length === 0) {
  //     return true
  //   }
    
  //   for (const range of this.selectedPriceRanges) {
  //     const price = product.productRate
  //     if (price >= range.min && price <= range.max) {
  //       return true
  //     }
  //   }
    
  //   return false
  // }

}
