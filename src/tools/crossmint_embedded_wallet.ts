import { SolanaAgentKit } from "../index";

interface CrossmintWalletResponse {
  status: "success" | "error";
  walletId?: string;
  address?: string;
  message?: string;
  code?: string;
}

/**
 * Create an embedded wallet using Crossmint's API
 * @param agent SolanaAgentKit instance
 * @param linkedUser User identifier (email or custom ID prefixed with 'email:' or 'id:')
 * @param apiKey Crossmint API key
 * @returns Object containing wallet details or error information
 */
export async function createCrossmintWallet(
  agent: SolanaAgentKit,
  linkedUser: string,
  apiKey: string,
): Promise<CrossmintWalletResponse> {
  try {
    // Validate linkedUser format
    if (!linkedUser.startsWith("email:") && !linkedUser.startsWith("id:")) {
      throw new Error(
        "linkedUser must start with 'email:' or 'id:' followed by the identifier",
      );
    }

    // Validate API key
    if (!apiKey || !apiKey.startsWith("sk_")) {
      throw new Error("Invalid Crossmint API key format");
    }

    const response = await fetch(
      "https://staging.crossmint.com/api/v1-alpha2/wallets",
      {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "solana-mpc-wallet",
          linkedUser: linkedUser,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();

    return {
      status: "success",
      walletId: data.walletId,
      address: data.address,
    };
  } catch (error: any) {
    return {
      status: "error",
      message: error.message,
      code: error.code || "WALLET_CREATION_ERROR",
    };
  }
}

/**
 * Get details of an existing Crossmint wallet
 * @param agent SolanaAgentKit instance
 * @param walletId ID of the wallet to retrieve
 * @param apiKey Crossmint API key
 * @returns Object containing wallet details or error information
 */
export async function getCrossmintWallet(
  agent: SolanaAgentKit,
  walletId: string,
  apiKey: string,
): Promise<CrossmintWalletResponse> {
  try {
    const response = await fetch(
      `https://staging.crossmint.com/api/v1-alpha2/wallets/${walletId}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();

    return {
      status: "success",
      walletId: data.walletId,
      address: data.address,
    };
  } catch (error: any) {
    return {
      status: "error",
      message: error.message,
      code: error.code || "WALLET_FETCH_ERROR",
    };
  }
}

/**
 * List all Crossmint wallets for the API key
 * @param agent SolanaAgentKit instance
 * @param apiKey Crossmint API key
 * @returns Array of wallet objects or error information
 */
export async function listCrossmintWallets(
  agent: SolanaAgentKit,
  apiKey: string,
): Promise<CrossmintWalletResponse | { status: "success"; wallets: any[] }> {
  try {
    const response = await fetch(
      "https://staging.crossmint.com/api/v1-alpha2/wallets",
      {
        method: "GET",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();

    return {
      status: "success",
      wallets: data.wallets,
    };
  } catch (error: any) {
    return {
      status: "error",
      message: error.message,
      code: error.code || "WALLET_LIST_ERROR",
    };
  }
}
