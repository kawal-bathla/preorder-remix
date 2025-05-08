import { Button } from "@shopify/polaris";

export const RSPicker = (props) => {
  const { setData } =
    props;

  const rsPicker = async () => {
    let productsDetails = await shopify.resourcePicker({
      type: "product",
      action: "add",
      multiple: true,
    //   selectionIds: selectedProducts,
    });
    
    if (productsDetails) {
        setData(productsDetails);
    //   let selectedProductsId = [];
    //   let productsData = [];
    //   productsDetails.map((item, index) => {
    //     productsData.push({
    //       createdAt: item.createdAt,
    //       descriptionHtml: item.descriptionHtml,
    //       id: item.id,
    //       images: item.images,
    //       title: item.title,
    //       totalInventory: item.totalInventory,
    //       totalVariants: item.totalVariants,
    //       collectionsData: [],
    //       variantsData: [],
    //     });
    //     selectedProductsId.push({
    //       id: item.id,
    //       variants: [],
    //     });
    //     productsDetails[index].variants.map((variants) => {
    //       selectedProductsId[index].variants.push({ id: variants.id });
    //       productsData[index].variantsData.push({
    //         status: "In review",
    //         enableVtoBtn: true,
    //         sku: variants.sku,
    //         availableForSale: variants.availableForSale,
    //         displayName: variants.displayName,
    //         id: variants.id,
    //         image: variants?.image || null,
    //         options: [],
    //         inventoryQuantity: variants.inventoryQuantity,
    //         price: variants.price,
    //         product: variants.product,
    //         title: variants.title,
    //         updatedAt: variants.updatedAt,
    //       });
    //     });
    //   });
    //   if (productsData) {
    //     setPickerData(productsData);
    //   }
    //   if (selectedProductsId) {
    //     setSelectedProducts(selectedProductsId);
    //   }
    }
  };
  
  return (
    <>
      <Button variant="primary" onClick={rsPicker}>Add Product</Button>
    </>
  );
};