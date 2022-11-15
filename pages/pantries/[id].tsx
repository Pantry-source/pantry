import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../api';
import ProductEditor from '../../components/ProductEditor';
import SlideOver from '../../components/SlideOverDialog';
import Filter from '../../components/Filter';

function cl(...a) {
  console.log(a)
}

export default function Pantry() {
  const [pantry, setPantry] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoriesMap, setCategoriesMap] = useState(null);
  const [units, setUnits] = useState(null);
  const [unitsMap, setUnitsMap] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({});
  const [isAddingProducts, setIsAddingProducts] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);;
  const [isPantryLoading, setIsPantryLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isUnitMapLoading, setIsUnitMapLoading] = useState(true);
  const [filterProperties, setFilterProperties] = useState({});

  function onProductChange(e) {
    // for boolean product attributes use "checked" property of input instead of "value" so that the value is boolean and not string
    const value = e.target.name === 'is_essential' ? e.target.checked : e.target.value;
    setCurrentProduct(() => ({
      ...currentProduct,
      [e.target.name]: value === '' ? null : value
    }));
  }

  const router = useRouter();
  const { id } = router.query;

  async function fetchPantry() {
    const response = await supabase
      .from('pantries')
      .select(`*, products(*)`)
      .filter('id', 'eq', id)
      .single();
    const { error, data } = response;
    try {
      if (error) throw new Error("no pantry data");
      setPantry(data);
      setCurrentProduct(() => ({ ...currentProduct, 'pantry_id': data.id }));
      setIsPantryLoading(false);
    } catch (error) {
      setIsPantryLoading(true);
    }
    return response;
  }

  async function fetchCategories() {
    const response = await supabase
      .from('categories')
      .select(`*`);
    const { error, data } = response;
    try {
      if (error) throw new Error("no categories data");
      setCategories(data);
      setCategoriesMap(data?.reduce((previous, category) => {
        return {
          ...previous,
          [category.id]: category.name
        };
      }, {}));
      setIsCategoriesLoading(false);
    } catch (error) {
      setIsCategoriesLoading(true);
    }
    return response;
  }

  async function fetchQuantityUnits() {
    const response = await supabase
      .from('quantity_units')
      .select(`*`);
    const { error, data } = response;
    try {
      if (error) throw new Error("no quantity units data");
      setUnits(data);
      setUnitsMap(data?.reduce((previous, category) => {
        return {
          ...previous,
          [category.id]: category.name
        };
      }, {}));
      setIsUnitMapLoading(false);
    } catch (error) {
      setIsUnitMapLoading(true);
    }
    return response;
  }

  async function selectProduct(product) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('name', product.name)
      .single();
    setCurrentProduct(data);
    setIsAddingProducts(true);
  }

  async function updateProduct() {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: currentProduct.name,
        quantity_amount: currentProduct.quantity_amount,
        is_essential: currentProduct.is_essential,
        quantity_unit: currentProduct.quantity_unit,
        vendor: currentProduct.vendor,
        category_id: currentProduct.category_id
      })
      .eq('id', currentProduct.id)
    if (error) {
      setErrorMessages(errorMessages => [...errorMessages, error]);
    } else {
      setIsAddingProducts(false);
      fetchPantry();
    }
  }

  async function createProduct() {
    const { data, error } = await supabase
      .from('products')
      .insert([currentProduct]);
    if (error) {
      setErrorMessages(errorMessages => [...errorMessages, error]);
    } else {
      setIsAddingProducts(false);
      fetchPantry();
    }
  }

  useEffect(() => {
    fetchPantry();
    fetchCategories();
    fetchQuantityUnits();
  }, [id])

  if (isPantryLoading || isCategoriesLoading || isUnitMapLoading) {
    return <h1>loading...</h1>;
  }

  const currentProducts = pantry.products.reduce((categoryAndProducts, product) => {
    let categoryName = categoriesMap[product.category_id]
    categoryAndProducts[categoryName]
      ? categoryAndProducts[categoryName].push(product)
      : categoryAndProducts[categoryName] = [product];
    return categoryAndProducts;
  }, {});

  const categoriesWithProducts = categories.filter(category => {
    // if (category.name === 'Produce') {
    category.products = currentProducts[category.name] || null;
    return category;
    // }
  });

  cl('categoriesWithProducts', categoriesWithProducts)
  const { description, title } = pantry;
  function addProducts() {
    setCurrentProduct(() => ({ 'pantry_id': pantry.id }));
    setIsAddingProducts(true);
  }

  //NOTE: consider using Set data structure ds
  /** Retrieves activeFilters from Filter and updates FilterProperties state  */
  function updateFilters(filter) {
    // const filterValues = filters.reduce((values, filter) => {
    //   values[filter.label] = filter.value;
    //   return values;
    // },{});
    // cl('filterValues', filterValues);
    // setFilterProperties([...filters, filterValues]);

    if (filterProperties[filter.label]){

      setFilterProperties((current) => {
        const copy = {...current};
        delete copy[filter.label];  
        cl('copy',copy)
        setFilterProperties(copy);
        return copy;
      })
    }
    cl('filter', filter)

    setFilterProperties(filterProperties =>
      ({ ...filterProperties, [filter.label]: filter.value }));
  }

  // setCurrentProduct(() => ({ ...currentProduct, 'pantry_id': data.id }));

  function onSubmitProduct(e) {
    e.preventDefault();
    setErrorMessages([]);
    currentProduct.id ? updateProduct() : createProduct();
  }

  function onCloseProductForm() {
    setIsAddingProducts(false);
    setErrorMessages([])
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

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
              onClick={addProducts}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto">
              Add Products
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <Filter
                  updateFilters={updateFilters}
                  validCategories={categories.filter(category => category.products)} />
                <table className="min-w-full">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Is Essential
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Expires
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Vendor
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {categoriesWithProducts.map((category, productIdx) => (
                      category.products &&
                      <Fragment key={category.name}>
                        <tr className="border-t border-gray-200">
                          <th
                            colSpan={5}
                            scope="colgroup"
                            className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6">
                            {category.name}
                          </th>
                        </tr>
                        {category.products.map((item) => (
                          <tr
                            key={item.name}
                            className={classNames(productIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {item.name}
                              <div className="mt-0.5 text-gray-500">
                                {item.quantity_amount} {unitsMap && unitsMap[item.quantity_unit]}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.is_essential ? 'yes' : 'no'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.expires_at || 'not specified'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.vendor || ''}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                type="button"
                                onClick={() => selectProduct(item)}
                                className="text-indigo-600 hover:text-indigo-900">
                                Edit<span className="sr-only">,{item.name}</span>
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
      <SlideOver
        isExistingProduct={currentProduct.id}
        open={isAddingProducts}
        onClose={onCloseProductForm}
        onSubmit={(e) => onSubmitProduct(e)}
        title="New product"
        subtitle={`Fillout the information below to add a product to ${title}`}>
        <ProductEditor
          product={currentProduct}
          categories={categories}
          units={units}
          onProductChange={onProductChange}
          errorMessages={errorMessages}
        />
      </SlideOver>
    </div>
  )
}
