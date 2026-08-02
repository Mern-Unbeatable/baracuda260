import React, { memo } from 'react';
import { Shell } from '../site';

const AboutCta = memo(() => (
  <section className="bg-white pb-16 sm:pb-20 xl:pb-[120px]">
    <Shell>
      <div className="rounded-[20px] border border-black/15 px-4 py-14 text-center sm:px-8 sm:py-16 xl:px-[393px] xl:py-[92px]">
        <div className="mx-auto flex max-w-[749px] flex-col items-center gap-8">
          <div className="flex w-full flex-col gap-7">
            <p className="text-[16px] font-bold uppercase tracking-[1.2px] text-[#4048cd]">
              No Fee to Register
            </p>
            <div className="flex flex-col gap-4">
              <h2 className="text-[32px] font-extrabold leading-tight text-[#0d0d14] sm:text-[40px] xl:text-[48px] xl:leading-[66px]">
                Ready to Share Your Photography With the World?
              </h2>
              <p className="text-[16px] leading-normal text-[#6b7280] sm:text-[20px]">
                Join thousands of photographers competing every month. Upload your best work,
                receive community votes, and become our next monthly winner.
              </p>
            </div>
          </div>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
          >
            Register Free
          </a>
        </div>
      </div>
    </Shell>
  </section>
));

AboutCta.displayName = 'AboutCta';

export default AboutCta;
