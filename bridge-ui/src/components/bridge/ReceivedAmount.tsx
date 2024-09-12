import { useAccount } from "wagmi";
import { PiApproximateEqualsBold } from "react-icons/pi";
import { useChainStore } from "@/stores/chainStore";
import { formatBalance } from "@/utils/format";
import useTokenPrices from "@/hooks/useTokenPrices";
import { zeroAddress } from "viem";
import { NetworkType } from "@/config";

type ReceivedAmountProps = {
  receivedAmount?: string;
};

export function ReceivedAmount({ receivedAmount }: ReceivedAmountProps) {
  const { isConnected } = useAccount();
  const { token, fromChain, tokenAddress, networkType } = useChainStore((state) => ({
    token: state.token,
    fromChain: state.fromChain,
    tokenAddress: state.token?.[state.networkLayer] || zeroAddress,
    networkType: state.networkType,
  }));

  const { data: tokenPrices } = useTokenPrices([tokenAddress], fromChain?.id);

  return (
    <div className="flex min-h-20 flex-col gap-2 rounded-lg bg-[#2D2D2D] p-3">
      {isConnected && (
        <>
          <span className="text-2xl font-bold text-white">
            {formatBalance(receivedAmount) || 0} {token?.symbol}
          </span>
          {networkType === NetworkType.MAINNET && (
            <span className="label-text flex items-center">
              <PiApproximateEqualsBold /> $
              {tokenPrices?.[tokenAddress]?.usd
                ? (Number(receivedAmount) * tokenPrices?.[tokenAddress]?.usd).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 10,
                  })
                : "0.00"}
            </span>
          )}
        </>
      )}
    </div>
  );
}