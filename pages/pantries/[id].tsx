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

export default function Pantry() {
  const [pantry, setPantry] = useState<pantryApi.PantryWithProducts>();
  const [categories, setCategories] = useState<categoryApi.Category[]>([]);
  const [units, setUnits] = useState<quantityUnitApi.QuantityUnit[]>([]);
  const [unitsMap, setUnitsMap] = useState<quantityUnitApi.QuantityUnitMap>({});
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [isPantryLoading, setIsPantryLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isUnitMapLoading, setIsUnitMapLoading] = useState(true);
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<productApi.Product[]>([])
  const [currentProduct, setCurrentProduct] = useState<productApi.Product>();

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
      setUnitsMap(data.reduce((previous, unit) => {
        return {
          ...previous,
          [unit.id]: unit.name
        };
      }, {}));
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
    for (let product of selectedProducts) {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)
        .single();

        setSelectedProducts(products => [])
      }
      fetchPantry();
  }

  function toggleAll() {
    if (pantry) {
      setSelectedProducts(checked || indeterminate ? [] : pantry.products)
      setChecked(!checked && !indeterminate)
      setIndeterminate(false)
    }
  }

  useEffect(() => {
    fetchPantry();
    fetchCategories();
    fetchQuantityUnits();
  }, [id])

  if (!pantry || isPantryLoading || isCategoriesLoading || isUnitMapLoading) {
    return <h1>loading...</h1>;
  }

  const { description, products, title } = pantry;
  const categoriesWithProducts: categoryApi.CategoryWithProducts[] = categories.reduce((previous, category) => {
    const productsInCategory = products.filter(p => p.category_id === category.id);
    if (productsInCategory.length) {
      previous.push({
        ...category,
        products: productsInCategory
      });
    }
    return previous;
  }, [] as any[]);

  return (
    <div>
      <div>
        <div className="flex items-top mb-6">
          <div className="flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-700">{description}</p>
          </div>
          <div className="mt-4 mt-0 ml-16 flex-none">
            <button
              type="button"
              onClick={() => setIsProductEditorOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto">
              Add Products
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="mt-8">
          <div>
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <div className="relative w-12 px-6 sm:w-16 sm:px-8" style={{ top: "1.5625em" }}> {/* 25px */}
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                    checked={checked}
                    onChange={toggleAll} />
                </div>
                {selectedProducts.length > 0 && (
                  <div className="absolute top-0 left-12 flex h-12 items-center space-x-3  sm:left-16">
                    <button
                      type="button"
                      className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">
                      Out Of Stock
                    </button>
                    <button
                      type="button"
                      onClick={deleteProduct}
                      className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">
                      {pantry.products.length === selectedProducts.length ? "Delete all" : "Delete"}
                    </button>
                  </div>
                )}
                <Filter validCategories={categoriesWithProducts} />
                <table className="min-w-full">
                  <thead className="bg-white text-gray-500">
                    <tr>
                      <th scope="col" className="relative w-12 pl-6 pr-3">
                      </th>
                      <th scope="col" className="py-3.5 px-3 text-left text-sm font-normal">
                      </th>
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
                    {categoriesWithProducts.map((category, productIdx) => (
                      category.products &&
                      <Fragment key={category.name}>
                        <tr className="border-t border-gray-200 bg-gray-50">
                          <th
                            colSpan={7}
                            scope="colgroup"
                            className="bg-gray-50 py-2 px-6 text-left text-m font-semibold text-gray-900">
                            {category.name}
                          </th>
                        </tr>
                        {category.products.map((product) => (
                          <tr
                            key={product.name}
                            className={classNames(productIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}>
                            <td className="relative w-12 pl-6 pr-3">
                              {selectedProducts.includes(product) && (
                                <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                              )}
                              <input
                                type="checkbox"
                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
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
                            <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900">
                              {product.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <PillButton
                                label={unitsMap[product.quantity_unit]}
                                id={product.id}
                                updateCount={updateProductQuantity}
                                count={product?.quantity_amount || 0} />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.is_essential ? 'yes' : 'no'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.expires_at || 'not specified'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.vendor || ''}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                type="button"
                                onClick={() => startEditingProduct(product)}
                                className="text-indigo-600 hover:text-indigo-900">
                                Edit<span className="sr-only">,{product.name}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  )
}
