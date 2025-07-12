'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';


export default function CreateListing() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cost: '',
        images: [],
        condition: 'good',
        tags: [],
        size: '',
        category: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(value) 
                ? prev.tags.filter(tag => tag !== value)
                : [...prev.tags, value]
        }));
    };

    const handleAddImage = () => {
        if (imageUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, imageUrl.trim()]
            }));
            setImageUrl('');
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            console.log('Form submitted:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Listing created successfully!');
        } catch (error) {
            console.error('Error creating listing:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const tagOptions = [
        "shirt", "t-shirt", "blouse", "tank-top", "sweater", "hoodie", "cardigan", 
        "jacket", "coat", "blazer", "vest", "pants", "jeans", "trousers", "shorts", 
        "leggings", "skirt", "dress", "jumpsuit", "romper", "underwear", "bra", 
        "socks", "tights", "shoes", "sneakers", "boots", "sandals", "heels", "flats", 
        "accessories", "hat", "cap", "scarf", "gloves", "belt", "bag", "purse", 
        "backpack", "jewelry", "watch", "sunglasses"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-4"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create New Listing</h1>
                    <p className="text-lg text-neutral-600">Share your pre-loved fashion items with the community</p>
                </div>
                
                <div className="card bg-white shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    maxLength={100}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g., Vintage Denim Jacket"
                                />
                            </div>

                            <div>
                                <label htmlFor="cost" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Cost (Points)
                                </label>
                                <input
                                    type="number"
                                    id="cost"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g., 75"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                maxLength={1000}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Describe your item's condition, style, and any special features..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Images
                            </label>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="Enter image URL"
                                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddImage}
                                        className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors duration-200 inline-flex items-center"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </button>
                                </div>
                                
                                {formData.images.length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed border-neutral-300 rounded-lg">
                                        <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                                        <p className="text-neutral-600">At least one image is required</p>
                                        <p className="text-sm text-neutral-500 mt-1">Add image URLs to showcase your item</p>
                                    </div>
                                )}
                                
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {formData.images.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <img 
                                                    src={url} 
                                                    alt={`Preview ${index + 1}`} 
                                                    className="w-full h-24 object-cover rounded-lg border border-neutral-200" 
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="condition" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Condition
                                </label>
                                <select
                                    id="condition"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="new">New</option>
                                    <option value="like-new">Like New</option>
                                    <option value="excellent">Excellent</option>
                                    <option value="good">Good</option>
                                    <option value="fair">Fair</option>
                                    <option value="poor">Poor</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">Select category</option>
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                    <option value="unisex">Unisex</option>
                                    <option value="kids">Kids</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="size" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Size
                                </label>
                                <select
                                    id="size"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">Select size</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                    <option value="XXXL">XXXL</option>
                                    <option value="one-size">One Size</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Tags (select at least one)
                            </label>
                            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {tagOptions.map(tag => (
                                        <div key={tag} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`tag-${tag}`}
                                                value={tag}
                                                checked={formData.tags.includes(tag)}
                                                onChange={handleTagChange}
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mr-2"
                                            />
                                            <label htmlFor={`tag-${tag}`} className="text-sm text-neutral-700 capitalize">
                                                {tag}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {formData.tags.length === 0 && (
                                <p className="text-red-500 text-sm mt-2">At least one tag is required</p>
                            )}
                        </div>
                        
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || formData.images.length === 0 || formData.tags.length === 0}
                                className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Listing'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}