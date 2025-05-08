import {
  Box,
  Card,
  Layout,
  List,
  Page,
  Text,
  BlockStack,
  Button,
  Icon,
  InlineStack,
  InlineGrid,
  IndexFilters,
  IndexFiltersMode,
  useSetIndexFiltersMode,
  IndexTable,
  Link,
  useIndexResourceState,
  Tabs,
  Badge,
  Spinner,
  Thumbnail,
  EmptySearchResult,
  Select,
  useBreakpoints,
} from "@shopify/polaris";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import {
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DiscountIcon,
  SettingsIcon,
} from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { RSPicker } from "../common component/resourcePicker";
import noImage from "../assets/no-image.png";

export default function AddProducts() {
  const [selected, setSelected] = useState(0);
  const [data, setData] = useState([]);
  let [queryValue, setQueryValue] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loadSpinner, setLoadSpinner] = useState(false);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
  const [expandedRows, setExpandedRows] = useState([]);
  const [variantsCount, setVariantsCount] = useState(0);

  const toggleRow = (e, id) => {
    e.stopPropagation();
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  //handle tabs change
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  // tabs for the index table
  const tabLabels = ["All", "Pre-order", "Coming Soon", "Partial"];
  const tabs = tabLabels.map((label, index) => {
    const idBase = label.toLowerCase().replace(/\s+/g, "-");
    return {
      id: `${idBase}-${index + 1}`,
      content: label,
      accessibilityLabel: `${label} tab`,
      panelID: `${idBase}-content-${index + 1}`,
    };
  });

  // products selection functionality
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(searchData);
  console.log(selectedResources, "selectedResources");

  const resourceName = {
    singular: "product",
    plural: "Products",
  };

  const options = [
    { label: "Enable", value: "enable" },
    { label: "Disable", value: "disable" },
  ];

  // handle products disbale functionality
  const handleSelectChange = (e, type) => {
    console.log("e", e);
    // e.stopPropagation();
  };

  // handle products enable functionality
  const enableProducts = (e, type) => {
    e.stopPropagation();
  };

  // handle modal open and close functionality
  const handleModal = (e, type) => {
    e.stopPropagation();
    shopify.modal.show("my-modal");
  };

  // handle show variants of a products functionality
  const showVariantsHandler = (e, type) => {
    e.stopPropagation();
  };

  // handle bulk action functionality
  const bulkActionGroups = ["Pre-order", "Coming Soon", "Partial"];
  const promotedBulkActions = [
    ...bulkActionGroups.map((label) => ({
      title: label,
      actions: [
        {
          content: "Enable",
          onAction: () => console.log(`${label}: Enable`),
        },
        {
          content: "Disable",
          onAction: () => console.log(`${label}: Disable`),
        },
      ],
    })),
    {
      content: "Limit Setting",
      onAction: () => console.log("Limit Setting"),
    },
  ];
  console.log("searchData", searchData);

  useEffect(() => {
    const totalExpandedVariants = data.reduce((sum, product) => {
      if (expandedRows.includes(product.id)) {
        return sum + (product.variants?.length || 0);
      }
      return sum;
    }, 0);
    setVariantsCount(totalExpandedVariants);
  }, [expandedRows, data]);
  
  // handle rows of the index table
  const rowMarkup = searchData.flatMap(
    ({ id, images, title, variants }, index) => {
      const isExpanded = expandedRows.includes(id);
      const rows = [
        <IndexTable.Row
          id={id}
          rowType="data"
          key={id}
          // selectionRange={searchData.length + variantsCount}
          // position={index}
          selected={selectedResources.includes(id)}
        >
          <IndexTable.Cell>
            <BlockStack gap="200">
              <Thumbnail source={images[0]?.originalSrc} />
              <Box maxWidth="100px">
                <Text variant="bodyMd" fontWeight="bold" as="span">
                  {title}
                </Text>
              </Box>
            </BlockStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Select
              options={options}
              onChange={(e, d) => handleSelectChange(d, "pre-order")}
              value={selected}
            />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Select
              options={options}
              onChange={(e, d) => handleSelectChange(d, "coming-soon")}
              value={selected}
            />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Select
              options={options}
              onChange={(e, d) => handleSelectChange(d, "partial")}
              value={selected}
            />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <InlineStack gap={100}>
              <Button
                onClick={(e) => {
                  handleModal(e, "percentage");
                }}
                size="large"
              >
                <Icon source={DiscountIcon} tone="base" />
              </Button>
              <Button
                onClick={(e) => {
                  handleModal(e, "settings");
                }}
                size="large"
              >
                <Icon source={SettingsIcon} tone="base" />
              </Button>
              <Button onClick={(e) => toggleRow(e, id)} size="large">
                <Icon source={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
              </Button>
            </InlineStack>
          </IndexTable.Cell>
        </IndexTable.Row>,
      ];

      if (isExpanded && variants?.length) {
        variants.forEach((variant) => {
          rows.push(
            <>
              <IndexTable.Row
                id={variant.id}
                key={`${id}-${variant.id}`}
                position={index}
                rowType="child"
                selected={selectedResources.includes(variant.id)}
              >
                <IndexTable.Cell>
                  <InlineStack gap="200">
                    <Thumbnail source={variant.image?.originalSrc || noImage} />
                    <Text as="span" tone="subdued">
                      {variant.title}
                    </Text>
                  </InlineStack>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Select
                    options={options}
                    onChange={(e, d) => handleSelectChange(d, "pre-order")}
                    value={selected}
                  />
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Select
                    options={options}
                    onChange={(e, d) => handleSelectChange(d, "coming-soon")}
                    value={selected}
                  />
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Select
                    options={options}
                    onChange={(e, d) => handleSelectChange(d, "partial")}
                    value={selected}
                  />
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <InlineStack gap={100}>
                    <Button
                      onClick={(e) => {
                        handleModal(e, "percentage");
                      }}
                      size="large"
                    >
                      <Icon source={DiscountIcon} tone="base" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        handleModal(e, "settings");
                      }}
                      size="large"
                    >
                      <Icon source={SettingsIcon} tone="base" />
                    </Button>
                  </InlineStack>
                </IndexTable.Cell>
                {/* Add more variant-specific cells as needed */}
              </IndexTable.Row>
            </>,
          );
        });
      }
      return rows;
    },
  );

  const filters = [];

  const handleQueryValueChange = useCallback((value) => {
    setQueryValue(value);
  }, []);

  const filterData = () => {
    if (!queryValue.trim()) {
      setSearchData(data);
    } else {
      const filtered = data.filter(
        (product) =>
          product?.id?.toLowerCase().includes(queryValue.toLowerCase()) ||
          product?.title?.toLowerCase().includes(queryValue.toLowerCase()),
      );
      setSearchData(filtered);
    }
    // setCurrentPage(0);
  };

  useEffect(() => {
    filterData();
  }, [queryValue, data]);

  return (
    <Page title="All Products" primaryAction={<RSPicker setData={setData} />}>
      <InlineGrid columns={2} gap="200">
        <InlineStack>
          {/* <Icon source={AlertCircleIcon} tone="textCritical" /> */}
          <Text tone="critical">
            If the product title is highlighted in red, please double-check the
            product's inventory.
          </Text>
        </InlineStack>
        <InlineStack>
          <Text tone="success">
            If the product title is highlighted in green, please double-check
            the product's inventory.
          </Text>
        </InlineStack>
      </InlineGrid>
      <InlineStack>
        <Text tone="success">
          Note: Preorder will work with inventory 0 or less than 0.
        </Text>
      </InlineStack>

      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />

        <IndexFilters
          queryValue={queryValue}
          queryPlaceholder="Search Products"
          onQueryChange={handleQueryValueChange}
          onQueryClear={() => setQueryValue("")}
          tabs={[]}
          filters={filters}
          mode={mode}
          setMode={setMode}
        />

        <IndexTable
          resourceName={resourceName}
          itemCount={searchData.length + variantsCount}
          headings={[
            { title: "Product" },
            { title: "Pre-order Status" },
            { title: "Coming-Soon Status" },
            { title: "Partial Status" },
            { title: "Action" },
          ]}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          promotedBulkActions={promotedBulkActions}
          onSelectionChange={handleSelectionChange}
          // defaultSortDirection="ascending"
          // pagination={{
          //   hasPrevious: page > 1,
          //   hasNext: page * itemsPerPage < tier_plansData.data.length,
          //   onNext: () => handlePagination(page + 1),
          //   onPrevious: () => handlePagination(page - 1),
          // }}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
      <Modal variant="base" id="my-modal">
        <Box padding={300}>
          <Text as="p">Modal is open</Text>
        </Box>
        {/* <TitleBar title={`Delete Product Confirmation`}>
          <button
            onClick={() => {
              handleDeleteProduct();
            }}
            variant="primary"
          >
            Confirm
          </button>
          <button onClick={() => shopify.modal.hide("my-modal")}>Cancel</button>
        </TitleBar> */}
      </Modal>
    </Page>
  );
}
