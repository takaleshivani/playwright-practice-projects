import {test, expect} from '@playwright/test';
import { randomState } from '@helpers/states';

/**
 * API Challenge Test
 * Sends requests to the product API to search for a product by name,
 * retrieves its details, and verifies the product's name, price, description, and ID.
 */
test.describe('API challenge', () => {
    test('Get /products/{id}', async ({ request }) => {   
        const apiURL = "https://api.practicesoftwaretesting.com";
        const getProductResponse = await request.get(
                apiURL + "/products/search?q=thor%20hammer"
        );
        expect(getProductResponse.status()).toBe(200);
        const productBody = await getProductResponse.json();
        const productId = productBody.data[0].id;

        const response = await request.get(apiURL + "/products/" + productId);

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        console.log(responseBody);
        console.log("Product Name : ", responseBody.name);
        expect(responseBody.name).toBe("Thor Hammer");
        expect(responseBody.price).toBe(11.14);
        expect(responseBody.description).toBe(
                "Donec malesuada tempus purus. Integer sit amet arcu magna. Sed vel laoreet ligula, non sollicitudin ex. Mauris euismod ac dolor venenatis lobortis. Aliquam iaculis at diam nec accumsan. Ut sodales sed elit et imperdiet. Maecenas vitae molestie mauris. Integer quis placerat libero, in finibus diam. Interdum et malesuada fames ac ante ipsum primis in faucibus."
        );
        expect(responseBody.id).toBe(productId);
        expect(responseBody.price).toBeNumber();
    }
    );
});