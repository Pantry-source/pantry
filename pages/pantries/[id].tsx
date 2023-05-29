import classNames from '../../modules/classnames';
import { useEffect, useState, Fragment, useRef } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../api';
import ProductEditor from '../../components/ProductEditor';
import Filter from '../../components/Filter';
import PillButton from '../../components/PillButton';
import * as pantryApi from '../../modules/supabase/pantry';
import * as productApi from '../../modules/supabase/product';
import * as categoryApi from '../../modules/supabase/category';
import * as quantityUnitApi from '../../modules/supabase/quantityUnit';
import EmptyState from '../../components/EmptyState';

export default function Pantry() {
  const [pantry, setPantry] = useState<pantryApi.PantryWithProducts>();
  const [categories, setCategories] = useState<categoryApi.Category[]>([]);
  const [units, setUnits] = useState<quantityUnitApi.QuantityUnit[]>([]);
  const [unitsMap, setUnitsMap] = useState<quantityUnitApi.QuantityUnitMap>({});
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [isPantryLoading, setIsPantryLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isUnitMapLoading, setIsUnitMapLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<productApi.Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<productApi.Product>();

  const [categoryIds, setCategoryIds] = useState([]);
  const [filters, setFilters] = useState([]);


  const router = useRouter();
  const { id } = router.query;

  async function fetchPantry() {
    if (id) {
      setIsPantryLoading(true);

      // need to typecast as string because the id from Next's router query string has type "string | string[] | undefined"
      const { error, data } = await pantryApi.fetchByIdWithProducts(id as string);
      if (!error && data) {
        setPantry(data);
        setIsPantryLoading(false);
      } else {
        // TODO: needs error handling
        setIsPantryLoading(false);
      }
    }
  }

  async function fetchCategories() {
    setIsCategoriesLoading(true);
    const { error, data } = await categoryApi.fetchAll();
    if (!error && data) {
      setCategories(data);
      setIsCategoriesLoading(false);
    }
  }

  async function fetchQuantityUnits() {
    setIsUnitMapLoading(true);
    const response = await quantityUnitApi.fetchAll();
    const { error, data } = response;
    if (!error && data) {
      setUnits(data);
      setUnitsMap(
        data.reduce((previous, unit) => {
          return {
            ...previous,
            [unit.id]: unit.name
          };
        }, {})
      );
      setIsUnitMapLoading(false);
    }
    return response;
  }

  async function startEditingProduct(product: productApi.Product) {
    setCurrentProduct(product);
    setIsProductEditorOpen(true);
  }

  async function updateProductQuantity(id: number, quantity: number) {
    await productApi.updateQuantityAmountById(id, quantity);
    fetchPantry();
  }

  function onProductSave() {
    fetchPantry();
    fetchCategories();
    setCurrentProduct(undefined);
    setIsProductEditorOpen(false);
  }

  function onCancelProductEditing() {
    setCurrentProduct(undefined);
    setIsProductEditorOpen(false);
  }

  // removes selected product(s) from database and rerenders updated category list
  async function deleteProduct() {
    for (const product of selectedProducts) {
      const { data, error } = await supabase.from('products').delete().eq('id', product.id).single();

      setSelectedProducts((products) => []);
    }
    fetchPantry();
  }

  function toggleAll() {
    if (pantry) {
      setSelectedProducts(checked || indeterminate ? [] : pantry.products);
      setChecked(!checked && !indeterminate);
      setIndeterminate(false);
    }
  }

  /** retrives category ID from Filter.tsx to add/removes from categoryIDs */
  function updateCategoryIds(filter:any) {
    const categoryId = +filter.value;
    categoryIds.includes(categoryId)
      ? setCategoryIds(ids =>
        ids.filter(id => id !== categoryId))
      : setCategoryIds(ids => [...ids, categoryId]);
  }

  /** retrives Filter value from Filter.tsx to add/removes from filters */
  function updateFilterIds(filter:any) {
    filters.includes(filter)
      ? setFilters(filters =>
        filters.filter(f => f !== filter))
      : setFilters(filters => [...filters, filter]);
  }

  useEffect(() => {
    fetchPantry();
    fetchCategories();
    fetchQuantityUnits();
  }, [id]);

  if (!pantry || isPantryLoading || isCategoriesLoading || isUnitMapLoading) {
    return <h1>loading...</h1>;
  }

  const { description, products, title } = pantry;
  const categoriesWithProducts: categoryApi.CategoryWithProducts[] = categories.reduce((previous, category) => {
    const productsInCategory = products.filter((p) => p.category_id === category.id);
    if (productsInCategory.length) {
      previous.push({
        ...category,
        products: productsInCategory
      });
    }
    return previous;
  }, [] as any[]);

  // const activeFilters: { value: string; label: string }[] = [];

  return (
    <div>
      {pantry.products.length ? (
        <div>
          <div className="flex items-top mb-14">
            <div className="flex-auto">
              <h1 className="text-xl font-semibold text-stone-900">{title}</h1>
              <p className="mt-2 text-sm text-stone-700">{description}</p>
            </div>
            <div className="mt-4 mt-0 ml-16 flex-none">
              <button
                type="button"
                onClick={() => setIsProductEditorOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 sm:w-auto"
              >
                Add Products
              </button>
            </div>
          </div>
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <div className="flex-row items-center border-b border-gray-200">
                <div className="flex-none pl-6 pr-3 w-12">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                    checked={checked}
                    onChange={toggleAll}
                  />
                </div>
                <div className="flex-auto px-3">
                  {selectedProducts.length > 0 && (
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        className="inline-flex rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Out Of Stock
                      </button>
                      <button
                      
                        type="button"
                        onClick={deleteProduct}
                        className="inline-flex rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        {pantry.products.length === selectedProducts.length ? 'Delete all' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-none  py-4 text-sm">
                  <section aria-labelledby="filter-heading">
                    {/* sr-only means only show this to screen-readers */}
                    <h2 id="filter-heading" className="sr-only">
                      Filters
                    </h2>
                    <Filter
                      updateCategoryIds={updateCategoryIds}
                      updateFilters={updateFilterIds}
                      validCategories={categoriesWithProducts}
                    /> 
                    {/* {activeFilters.length > 0 && (
                      <div className="bg-gray-100">
                        <div className="mx-auto max-w-1xl py-3 px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
                          <h3 className="text-sm font-medium text-stone-500">
                            Filters
                            <span className="sr-only">, active</span>
                          </h3>

                          <div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />

                          <div className="mt-2 sm:mt-0 sm:ml-4">
                            <div className="-m-1 flex flex-wrap items-center">
                              {activeFilters.map((activeFilter) => (
                                <span
                                  key={activeFilter.value}
                                  className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-stone-900"
                                >
                                  <span>{activeFilter.label}</span>
                                  <button
                                    type="button"
                                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-stone-400 hover:bg-gray-200 hover:text-stone-500"
                                  >
                                    <span className="sr-only">Remove filter for {activeFilter.label}</span>
                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                    </svg>
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )} */}
                  </section>
                </div>
              </div>
              <table className="min-w-full">
                <thead className="bg-white text-stone-500">
                  <tr>
                    <th scope="col" className="relative w-12 pl-6 pr-3"></th>
                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-normal"></th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-normal">
                      Quantity
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-normal">
                      Is Essential
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-normal">
                      Expires
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-normal">
                      Vendor
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {console.log('categoriesWithProducts>>>>>>>>>>>',categoriesWithProducts)}
                  {categoriesWithProducts.map(
                    (category) =>
                      !categoryIds.includes(category.id) && (
                        <Fragment key={category.name}>
                          <tr className="border-t border-gray-200 bg-gray-50">
                            <th
                              colSpan={7}
                              scope="colgroup"
                              className="bg-gray-50 py-2 px-6 text-left text-m font-semibold text-stone-900"
                            >
                              {category.name}
                            </th>
                          </tr>
                          {category.products.map((product) => (
                            <tr key={product.name} className="border-gray-200 border-t">
                              <td className="relative w-12 pl-6 pr-3">
                                {selectedProducts.includes(product) && (
                                  <div className="absolute inset-y-0 left-0 w-0.5 bg-cyan-600" />
                                )}
                                <input
                                  type="checkbox"
                                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 sm:left-6"
                                  value={product.name}
                                  checked={selectedProducts.includes(product)}
                                  onChange={(e) =>
                                    setSelectedProducts(
                                      e.target.checked
                                        ? [...selectedProducts, product]
                                        : selectedProducts.filter((p) => p !== product)
                                    )
                                  }
                                />
                              </td>
                              <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-stone-900">
                                {product.name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-stone-500">
                                <PillButton
                                  label={unitsMap[product.quantity_unit]}
                                  id={product.id}
                                  updateCount={updateProductQuantity}
                                  count={product?.quantity_amount || 0}
                                />
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-stone-500">
                                {product.is_essential ? 'yes' : 'no'}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-stone-500">
                                {product.expires_at || 'not specified'}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-stone-500">
                                {product.vendor || ''}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                  type="button"
                                  onClick={() => startEditingProduct(product)}
                                  className="text-stone-700 hover:text-stone-900"
                                >
                                  Edit<span className="sr-only">,{product.name}</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          primaryAction="Add Products"
          onPrimaryActionClick={() => setIsProductEditorOpen(true)}
          header={title}
          subheading={description || ''}
        />
      )}

      <ProductEditor
        categories={categories}
        isOpen={isProductEditorOpen}
        onCancelProductEditing={onCancelProductEditing}
        onProductSave={onProductSave}
        pantry={pantry}
        selectedProduct={currentProduct}
        units={units}
      />
    </div>
  );
}
