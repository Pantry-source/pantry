import { useEffect, useState } from "react";
import { AlertFormList } from "./AlertComponents";
import Combobox from "./Combobox";
import * as categoryApi from '../modules/supabase/category';
import * as quantityUnitApi from '../modules/supabase/quantityUnit';
import * as pantryApi from '../modules/supabase/pantry';
import * as productApi from '../modules/supabase/product';
import { PostgrestError } from '@supabase/supabase-js';
import SlideOver from './SlideOverDialog';
import supabase from '../api';
import { Transition } from "@headlessui/react";
import CategoryManager from "./CategoryManager";

type ProductEditorProps = {
  isOpen: boolean,
  onCancelProductEditing: () => void,
  onProductSave: () => void,
  pantry: pantryApi.Pantry,
  selectedProduct?: productApi.Product,
  categories: categoryApi.Category[],
  units: quantityUnitApi.QuantityUnit[],
};

type ProductPartial = Partial<productApi.Product>;

export default function ProductEditor({
  categories,
  isOpen,
  onCancelProductEditing,
  onProductSave,
  pantry,
  selectedProduct,
  units
}: ProductEditorProps) {
  const [errorMessages, setErrorMessages] = useState<PostgrestError[]>([]);
  const [currentProduct, setCurrentProduct] = useState<ProductPartial>(selectedProduct || {});
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  // used to keep track of pre-fetched and newly added categories
  const [allCategories, setAllCategories] = useState<categoryApi.Category[]>(categories);

  const isExistingProduct = currentProduct?.id !== undefined;
  useEffect(() => {
    setCurrentProduct(selectedProduct || {});
  }, [selectedProduct]);

  const unitOptions = units.map(unit => <option value={unit.id} key={unit.id}>{unit.name}</option>);

  function onProductChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    // for boolean product attributes use "checked" property of input instead of "value" so that the value is boolean and not string
    let value: string | boolean | null = null;
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      value = e.target.checked;
    } else {
      value = e.target.value === '' ? null : e.target.value;
    }
    setCurrentProduct(() => ({
      ...currentProduct,
      [e.target.name]: value
    }));
  }

  async function createProduct() {
    const errors = [];
    const requiredFields: { field: keyof ProductPartial, validationError: string}[] = [
      {
        field: 'name',
        validationError: 'Please enter a name'
      },
      {
        field: 'quantity_unit',
        validationError: 'Please select quantity unit'
      },
      {
        field: 'category_id',
        validationError: 'Please select a category'
      }
    ];
    for (const requiredField of requiredFields) {
      if (currentProduct[requiredField.field] === undefined) {
        errors.push({
          message: requiredField.validationError,
          details: '', hint: '', code: ''
        });
      }
    }
    if (errors.length) {
      setErrorMessages(errors);
    } else {

      // we have to check these again because typescript does no understand the above validation
      if (currentProduct.category_id !== undefined &&
        currentProduct.name &&
        currentProduct.quantity_unit !== undefined) {
        const { data, error } = await supabase
          .from('products')
          .insert([{
            is_essential: currentProduct?.is_essential || false,
            quantity_unit: currentProduct.quantity_unit,
            quantity_amount: currentProduct?.quantity_amount || 0,
            category_id: currentProduct.category_id,
            name: currentProduct.name,
            vendor: currentProduct.vendor,
            expires_at: currentProduct.expires_at,
            pantry_id: pantry.id
          }]);
        if (error) {
          setErrorMessages(errorMessages => [...errorMessages, error]);
        } else {
          onProductSave();
        }
      }
    }
  }

  async function updateProduct() {
    if (currentProduct) {
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
        onProductSave();
      }
    }
  }

  function onSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setErrorMessages([]);
    currentProduct && currentProduct.id ? updateProduct() : createProduct();
  }

  function onClose() {
    onCancelProductEditing();
    setErrorMessages([])
  }

    /** Receives selected option(category object) from Combobox
     * if category id === false, fetch id for newly created category
      */
    async function onCategorySelect(category: categoryApi.Category) {
      if (category.id) {
        onCategoryChange(category.id);
      }
    }
  
  /** adds selected Category id to currentProduct */
  function onCategoryChange(categoryId: number) {
    setCurrentProduct(() => ({
      ...currentProduct,
      'category_id': categoryId
    }));
  }

  async function createCategory(categoryName: string) {
    const response = await categoryApi.create(categoryName, pantry.user_id);
    const { data, error } = response;
    if (error) {
      setErrorMessages(errorMessages => [...errorMessages, error]);
    } else {
      onCategoryChange(data.id);
      setAllCategories([ ...allCategories, data ])
      return data;
    }
  }

  function onCategoryDelete(category: categoryApi.Category) {
    setAllCategories(allCategories.filter(c => c.id !== category.id));
  }

  function renderCategoryManager() {
    return (
      <Transition
        appear={true}
        show={true}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
      <div className="space-y-1 px-4 pb-2 sm:space-y-0 sm:px-6 sm:py-5">
        <CategoryManager categories={allCategories} onCategoryDelete={onCategoryDelete} />
      </div>
    </Transition>
    );
  }

  function getDialogTitle() {
    return isEditingCategories ? 'Categories' : isExistingProduct ? 'Edit Product' : 'New Product';
  }

  function getDialogDoneAction() {
    return isEditingCategories ? 'Done' : isExistingProduct ?  "Update" : "Save";
  }

  function onDoneManagingCategories() {
    setIsEditingCategories(false);
  }

  return (
    <SlideOver
        doneAction={getDialogDoneAction()}
        open={isOpen}
        onClose={isEditingCategories ? onDoneManagingCategories : onClose}
        onSubmit={isEditingCategories ? onDoneManagingCategories :onSubmit}
        title={getDialogTitle()}
        subtitle={isEditingCategories ? '' : `Fillout the information below to add a product to ${pantry.title}`}>
      <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
        {
          isEditingCategories ? renderCategoryManager() : 
          (
            <form>
              {/* Product name */}
              <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                <div>
                  <label
                    htmlFor="product-name"
                    className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                    Product name
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    name="name"
                    id="product-name"
                    value={currentProduct?.name}
                    onChange={onProductChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>

                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="quantity_amount"
                    value={currentProduct?.quantity_amount || ''}
                    onChange={onProductChange}
                    id="amount"
                    className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0" />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="unit" className="sr-only">
                      Unit
                    </label>
                    <select
                      id="unit"
                      name="quantity_unit"
                      onChange={onProductChange}
                      value={currentProduct?.quantity_unit}
                      className="focus:ring-cyan-500 focus:border-cyan-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md">
                      <option value=''>Select Unit</option>
                      {unitOptions}
                    </select>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                    Category
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <Combobox
                    options={allCategories}
                    preselectedValue={allCategories.find(category => category.id === currentProduct.category_id)}
                    onSelect={onCategorySelect}
                    createOption={createCategory}
                  />
                  <div className="py-4">
                    <a href="#" className="text-sm font-medium leading-6 text-cyan-700" onClick={() => {setIsEditingCategories(true)}}>
                      Manage categories <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Is Essential */}
              <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                <legend className="sr-only">Is Essential</legend>
                <div className="text-sm font-medium text-gray-900" aria-hidden="true">
                  Is Essential
                </div>
                <div className="space-y-5 sm:col-span-2">
                  <div className="space-y-5 sm:mt-0">
                    <div className="relative flex items-start">
                      <div className="absolute flex h-5 items-center">
                        <input
                          id="is-essential"
                          name="is_essential"
                          onChange={onProductChange}
                          aria-describedby="is-essential-description"
                          type="checkbox"
                          className="h-4 w-4 border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          defaultChecked={currentProduct?.is_essential} />
                      </div>
                      <div className="pl-7 text-sm">
                        <label htmlFor="is-essential" className="font-medium text-gray-900">
                          Yes
                        </label>
                        <p id="is-essential-description" className="text-gray-500">
                          Will be marked as &quot;out of stock&quot; when runs out
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>


              {/* Vendor */}
              <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                <div>
                  <label
                    htmlFor="vendor"
                    className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2">
                    Vendor
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    name="vendor"
                    value={currentProduct?.vendor || ''}
                    onChange={onProductChange}
                    id="vendor"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm" />
                </div>
              </div>

              {/* Feedback */}
              {errorMessages[0] && <AlertFormList errorMessages={errorMessages} />}
            </form>
          )
        }
      </div>
    </SlideOver>
  );
};