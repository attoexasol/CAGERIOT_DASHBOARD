/**
 * Cover Art API Service
 * Supports both demo and live API modes
 */

import { API_CONFIG } from '../../config';
import { CoverArt, CreateCoverArtRequest, UpdateCoverArtRequest, CoverArtResponse, PresignedUrlResponse, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { logger } from '../../logger';
import { getApiHeaders, handleApiResponse } from '../helpers';
import { simulateDelay } from '../demo-data';
import { demoStorage } from '../demo-storage';

export const coverArtService = {
  /**
   * POST - Create new cover art
   */
  async create(coverArtData: CreateCoverArtRequest): Promise<CoverArt> {
    // Demo mode
    if (isDemoMode()) {
      logger.api('Creating cover art (demo mode)');
      await simulateDelay();
      
      const newCoverArt: CoverArt = {
        id: Date.now(),
        title: coverArtData.title,
        type: 'Cover Art',
        resource_number: coverArtData.resource_number || null,
        parental_advisory: coverArtData.parental_advisory || null,
        original_filename: null,
        cover_art_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      };
      
      demoStorage.add('coverArt', newCoverArt);
      
      return newCoverArt;
    }

    // Live API mode
    try {
      logger.api('Creating cover art (live API)');
      
      // Get auth token
      let token = localStorage.getItem('authToken');
      if (!token) {
        const username = API_CONFIG.USERNAME;
        const password = API_CONFIG.PASSWORD;
        token = btoa(`${username}:${password}`);
        localStorage.setItem('authToken', token);
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/cover_art`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(coverArtData),
      });

      const responseText = await response.text();
      let responseData: any = {};

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('❌ Failed to parse response:', responseText);
        if (!response.ok) {
          throw new Error(responseText || `Failed to create cover art: ${response.status}`);
        }
      }

      if (!response.ok) {
        const errorMessage = 
          responseData.message || 
          responseData.error || 
          `Failed to create cover art: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Handle API response format: { status, message, data }
      if (responseData.status && responseData.data) {
        logger.success('Cover art created successfully');
        return responseData.data;
      }

      // Fallback: assume response is the cover art directly
      logger.success('Cover art created successfully');
      return responseData;
    } catch (error: any) {
      logger.error('Create cover art failed:', error);
      throw new Error(error?.message || 'Failed to create cover art');
    }
  },

  /**
   * GET - Search cover art
   */
  async search(params?: ListParams): Promise<{ data: CoverArt[]; pagination?: any }> {
    // Demo mode
    if (isDemoMode()) {
      logger.api('Searching cover art (demo mode)');
      await simulateDelay();
      
      let coverArts = demoStorage.getAll<CoverArt>('coverArt');
      
      // Apply search filter
      if (params?.search) {
        const search = params.search.toLowerCase();
        coverArts = coverArts.filter(ca => 
          ca.title.toLowerCase().includes(search) ||
          ca.resource_number?.toLowerCase().includes(search)
        );
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        data: coverArts.slice(start, end),
        pagination: {
          page,
          limit,
          total: coverArts.length,
          totalPages: Math.ceil(coverArts.length / limit),
        },
      };
    }

    // Live API mode
    try {
      logger.api('Searching cover art (live API)');
      
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.search) queryParams.append('search', params.search);

      // Get auth token
      let token = localStorage.getItem('authToken');
      if (!token) {
        const username = API_CONFIG.USERNAME;
        const password = API_CONFIG.PASSWORD;
        token = btoa(`${username}:${password}`);
        localStorage.setItem('authToken', token);
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cover_art${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        }
      );

      const data = await handleApiResponse<any>(response);
      
      // Transform API response to expected format
      const coverArts: CoverArt[] = (data.results || data.data || []).map((item: any) => ({
        id: item.id,
        title: item.title || '',
        type: item.type || 'Cover Art',
        resource_number: item.resource_number || null,
        parental_advisory: item.parental_advisory || null,
        original_filename: item.original_filename || null,
        cover_art_url: item.cover_art_url || null,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        deleted_at: item.deleted_at || null,
      }));

      return {
        data: coverArts,
        pagination: data.pagination || {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: coverArts.length,
          totalPages: Math.ceil(coverArts.length / (params?.limit || 10)),
        },
      };
    } catch (error: any) {
      logger.error('Search cover art failed:', error);
      throw new Error(error?.message || 'Failed to search cover art');
    }
  },

  /**
   * GET - Get cover art by ID
   */
  async getById(id: string | number): Promise<CoverArt> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Fetching cover art ${id} (demo mode)`);
      await simulateDelay();
      
      const coverArt = demoStorage.getById<any>('coverArt', String(id));
      if (!coverArt) throw new Error('Cover art not found');
      return coverArt as CoverArt;
    }

    // Live API mode
    try {
      logger.api(`Fetching cover art ${id} (live API)`);
      
      // Get auth token
      let token = localStorage.getItem('authToken');
      if (!token) {
        const username = API_CONFIG.USERNAME;
        const password = API_CONFIG.PASSWORD;
        token = btoa(`${username}:${password}`);
        localStorage.setItem('authToken', token);
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/cover_art/${id}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
      });

      const data = await handleApiResponse<CoverArt>(response);
      return data;
    } catch (error: any) {
      logger.error(`Get cover art ${id} failed:`, error);
      throw new Error(error?.message || 'Failed to get cover art');
    }
  },

  /**
   * GET - Download cover art
   */
  async download(id: string | number): Promise<string> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Downloading cover art ${id} (demo mode)`);
      await simulateDelay();
      
      const coverArt = demoStorage.getById<any>('coverArt', String(id));
      if (!coverArt || !coverArt.cover_art_url) {
        throw new Error('Cover art not found or no URL available');
      }
      return coverArt.cover_art_url;
    }

    // Live API mode
    try {
      logger.api(`Downloading cover art ${id} (live API)`);
      
      // Get auth token
      let token = localStorage.getItem('authToken');
      if (!token) {
        const username = API_CONFIG.USERNAME;
        const password = API_CONFIG.PASSWORD;
        token = btoa(`${username}:${password}`);
        localStorage.setItem('authToken', token);
      }

      // Use GET /cover_art/{id}/download to get cover_art_url
      const response = await fetch(`${API_CONFIG.BASE_URL}/cover_art/${id}/download`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download cover art: ${response.status} ${response.statusText}`);
      }

      const apiResponse = await response.json();
      console.log('📥 Download endpoint response:', apiResponse);
      
      // Handle API response structure: might be { cover_art_url } or { data: { cover_art_url } } or { status, data: { cover_art_url } }
      let coverArtUrl = '';
      
      if (apiResponse.cover_art_url) {
        // Direct response: { cover_art_url: "..." }
        coverArtUrl = apiResponse.cover_art_url;
      } else if (apiResponse.data?.cover_art_url) {
        // Nested in data: { data: { cover_art_url: "..." } }
        coverArtUrl = apiResponse.data.cover_art_url;
      } else if (apiResponse.data && typeof apiResponse.data === 'string') {
        // Sometimes data is just the URL string
        coverArtUrl = apiResponse.data;
      }
      
      console.log('✅ Extracted cover_art_url:', coverArtUrl || '(null - file still processing)');
      
      // Return coverArtUrl even if null - let the caller decide what to do
      return coverArtUrl;
    } catch (error: any) {
      logger.error(`Download cover art ${id} failed:`, error);
      throw new Error(error?.message || 'Failed to download cover art');
    }
  },

  /**
   * PUT - Update cover art
   */
  async update(id: string | number, coverArtData: UpdateCoverArtRequest): Promise<CoverArt> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Updating cover art ${id} (demo mode)`);
      await simulateDelay();
      
      const updated = demoStorage.update<any>('coverArt', String(id), {
        ...coverArtData,
        updated_at: new Date().toISOString(),
      });
      
      if (!updated) throw new Error('Cover art not found');
      return updated as CoverArt;
    }

    // Live API mode
    try {
      logger.api(`Updating cover art ${id} (live API)`);
      
      // Get auth token
      let token = localStorage.getItem('authToken');
      if (!token) {
        const username = API_CONFIG.USERNAME;
        const password = API_CONFIG.PASSWORD;
        token = btoa(`${username}:${password}`);
        localStorage.setItem('authToken', token);
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/cover_art/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(coverArtData),
      });

      const responseText = await response.text();
      let responseData: any = {};

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('❌ Failed to parse response:', responseText);
        if (!response.ok) {
          throw new Error(responseText || `Failed to update cover art: ${response.status}`);
        }
      }

      if (!response.ok) {
        const errorMessage = 
          responseData.message || 
          responseData.error || 
          `Failed to update cover art: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Handle API response format: { status, message, data }
      if (responseData.status && responseData.data) {
        logger.success('Cover art updated successfully');
        return responseData.data;
      }

      // Fallback: assume response is the cover art directly
      logger.success('Cover art updated successfully');
      return responseData;
    } catch (error: any) {
      logger.error(`Update cover art ${id} failed:`, error);
      throw new Error(error?.message || 'Failed to update cover art');
    }
  },

  /**
   * PUT - Upload cover art file (server-side upload)
   * Endpoint: PUT /cover_art/{id}/upload/{filename}
   * Body: form-data with 'file' field
   */
  async uploadServer(id: string | number, file: File): Promise<CoverArtResponse> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Uploading cover art file ${id} (demo mode)`);
      await simulateDelay();
      
      const updated = demoStorage.update<any>('coverArt', String(id), {
        original_filename: file.name,
        updated_at: new Date().toISOString(),
      });
      
      if (!updated) throw new Error('Cover art not found');
      
      return {
        status: true,
        message: 'Cover art file uploaded successfully',
        data: updated as CoverArt,
      };
    }

    // Live API mode
    try {
      logger.api(`Uploading cover art file ${id} (live API)`);
      
      // Get auth token
      let token = localStorage.getItem('authToken');
      if (!token) {
        const username = API_CONFIG.USERNAME;
        const password = API_CONFIG.PASSWORD;
        token = btoa(`${username}:${password}`);
        localStorage.setItem('authToken', token);
      }

      // Extract file extension and create a clean filename
      // Use a simple filename like "track.jpg" instead of the original filename with special characters
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const cleanFilename = `track.${fileExtension}`;
      const encodedFilename = encodeURIComponent(cleanFilename);
      
      console.log('📝 Filename handling:', {
        original: file.name,
        clean: cleanFilename,
        encoded: encodedFilename,
      });
      
      // Create form-data with file
      const formData = new FormData();
      formData.append('file', file);

      // PUT request to /cover_art/{id}/upload/{filename}
      // Headers: Authorization (Basic Auth), Content-Type will be set automatically by browser with boundary
      const requestHeaders: HeadersInit = {
        Authorization: `Basic ${token}`,
        // Don't set Content-Type - browser will automatically set:
        // Content-Type: multipart/form-data; boundary=<calculated when request is sent>
      };

      console.log('📤 Server-side upload headers:', {
        Authorization: 'Basic [REDACTED]',
        'Content-Type': 'multipart/form-data (auto-set by browser with boundary)',
        method: 'PUT',
        url: `${API_CONFIG.BASE_URL}/cover_art/${id}/upload/${encodedFilename}`,
      });

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cover_art/${id}/upload/${encodedFilename}`,
        {
          method: 'PUT',
          mode: 'cors',
          headers: requestHeaders,
          body: formData,
        }
      );

      const responseText = await response.text();
      let responseData: any = {};

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('❌ Failed to parse response:', responseText);
        if (!response.ok) {
          throw new Error(responseText || `Failed to upload cover art: ${response.status}`);
        }
      }

      if (!response.ok) {
        const errorMessage = 
          responseData.message || 
          responseData.error || 
          `Failed to upload cover art: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Handle API response format: { status, message, data }
      logger.success('Cover art uploaded successfully');
      return {
        status: responseData.status ?? true,
        message: responseData.message || 'Cover art file uploaded successfully',
        data: responseData.data || responseData,
      };
    } catch (error: any) {
      logger.error(`Upload cover art ${id} failed:`, error);
      throw new Error(error?.message || 'Failed to upload cover art');
    }
  },

  /**
   * GET - Get presigned URL for client-side upload
   * Endpoint: GET /cover_art/{id}/presigned_url/
   * Returns: { url, fields } for direct S3 upload
   */
  async getPresignedUrl(id: string | number): Promise<PresignedUrlResponse> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Getting presigned URL for cover art ${id} (demo mode)`);
      await simulateDelay();
      
      return {
        url: 'https://demo.s3.amazonaws.com',
        fields: {
          key: `demo/cover_art/${id}/${Date.now()}`,
          acl: 'private',
          success_action_status: '200',
        },
      };
    }

    // Live API mode
    try {
      logger.api(`Getting presigned URL for cover art ${id} (live API)`);
      
      // Get auth token
      let token = localStorage.getItem('authToken');
      if (!token) {
        const username = API_CONFIG.USERNAME;
        const password = API_CONFIG.PASSWORD;
        token = btoa(`${username}:${password}`);
        localStorage.setItem('authToken', token);
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cover_art/${id}/presigned_url/`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get presigned URL: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const apiResponse = await response.json();
      
      // Handle API response structure: might be { url, fields } or { data: { url, fields } } or { status, data: { url, fields } }
      let presignedData: PresignedUrlResponse;
      
      if (apiResponse.data && (apiResponse.data.url || apiResponse.data.fields)) {
        // Response wrapped in data field: { status, data: { url, fields } }
        presignedData = apiResponse.data;
      } else if (apiResponse.url || apiResponse.fields) {
        // Direct response: { url, fields }
        presignedData = apiResponse;
      } else {
        console.error('Invalid presigned URL response structure:', apiResponse);
        throw new Error('Invalid presigned URL response structure');
      }
      
      // Log the presigned URL data for debugging
      console.log('📋 Presigned URL response:', {
        rawResponse: apiResponse,
        parsedData: presignedData,
        url: presignedData.url,
        fields: presignedData.fields,
        fieldKeys: Object.keys(presignedData.fields || {}),
      });
      
      if (!presignedData.url || !presignedData.fields) {
        throw new Error('Presigned URL response missing url or fields');
      }
      
      return presignedData;
    } catch (error: any) {
      logger.error(`Get presigned URL for cover art ${id} failed:`, error);
      throw new Error(error?.message || 'Failed to get presigned URL');
    }
  },

  /**
   * POST - Upload cover art file using presigned URL (client-side upload)
   * This method gets a presigned URL and uploads directly to S3
   */
  async uploadClient(id: string | number, file: File): Promise<void> {
    try {
      // Step 1: Request a pre-signed upload from the API
      const presignedData = await this.getPresignedUrl(id);
      
      if (!presignedData.url || !presignedData.fields) {
        throw new Error('Invalid presigned URL response: missing url or fields');
      }
      
      console.log('📤 Starting upload to presigned URL:', {
        url: presignedData.url,
        file: file.name,
        fileSize: file.size,
        fields: presignedData.fields,
      });
      
      // Step 2: Create form data with all fields from presigned response
      // IMPORTANT: Fields must be submitted in the same order as in the response
      const uploadFormData = new FormData();
      
      // Process key field first to replace ${filename} placeholder if needed
      let processedKey = presignedData.fields.key;
      if (processedKey && processedKey.includes('${filename}')) {
        processedKey = processedKey.replace('${filename}', file.name);
        console.log('🔑 Processed key field:', { original: presignedData.fields.key, processed: processedKey });
      }
      
      // Add all fields from the presigned response in order
      // Note: Object.keys() maintains insertion order for string keys in modern JS
      const fieldKeys = Object.keys(presignedData.fields);
      console.log('📝 Adding form fields in order:', fieldKeys);
      
      for (const key of fieldKeys) {
        let value = presignedData.fields[key];
        
        // Use processed key if this is the key field
        if (key === 'key' && processedKey) {
          value = processedKey;
        }
        
        if (value !== undefined && value !== null) {
          uploadFormData.append(key, value);
          console.log(`  ✓ Added field: ${key} = ${value.substring ? value.substring(0, 50) + '...' : value}`);
        }
      }
      
      // Step 3: Client attaches a file and submits the form
      // The file must be added last
      uploadFormData.append('file', file);
      console.log(`  ✓ Added file: ${file.name} (${file.size} bytes)`);
      
      logger.api(`Uploading file to presigned URL: ${presignedData.url}`);
      
      // Upload to the presigned URL (S3 endpoint, not our API)
      // The url from the response must be used as the form action
      // Headers: NO Authorization (presigned URLs don't need it), Content-Type will be set automatically by browser
      console.log('🚀 Sending client-side upload request to:', presignedData.url);
      console.log('📤 Client-side upload headers:', {
        Authorization: 'None (presigned URL)',
        'Content-Type': 'multipart/form-data (auto-set by browser with boundary)',
        method: 'POST',
        url: presignedData.url,
      });
      
      const uploadResponse = await fetch(presignedData.url, {
        method: 'POST', // Form submission method
        mode: 'cors',
        // Don't set Authorization - pre-signed URLs don't need it
        // Don't set Content-Type - browser will automatically set:
        // Content-Type: multipart/form-data; boundary=<calculated when request is sent>
        body: uploadFormData,
      });

      console.log('📥 Upload response:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        ok: uploadResponse.ok,
        headers: Object.fromEntries(uploadResponse.headers.entries()),
      });

      if (!uploadResponse.ok) {
        const uploadErrorText = await uploadResponse.text();
        console.error('❌ Cover art upload failed:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          error: uploadErrorText,
          url: presignedData.url,
        });
        throw new Error(
          `Cover art upload failed: ${uploadResponse.status} ${uploadResponse.statusText}. ${uploadErrorText || ''}`
        );
      }

      // Check if response has a body (S3 responses are often XML or empty on success)
      const responseText = await uploadResponse.text();
      console.log('✅ Upload successful! Response:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        body: responseText || '(empty response)',
        contentType: uploadResponse.headers.get('content-type'),
      });
      
      // S3 typically returns 200/204 on success, sometimes with XML body
      // If we get here, the upload was successful
      
      logger.success('Cover art file uploaded successfully to presigned URL');
      
      // Note: Files will automatically start processing after upload
      // Download verification is handled in the main flow, not here
    } catch (error: any) {
      logger.error(`Client-side upload for cover art ${id} failed:`, error);
      throw new Error(error?.message || 'Failed to upload cover art');
    }
  },
};

