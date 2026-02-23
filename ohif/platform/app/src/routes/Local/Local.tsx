import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DicomMetadataStore, MODULE_TYPES, useSystem } from '@ohif/core';

import Dropzone from 'react-dropzone';
import filesToStudies from './filesToStudies';

import { extensionManager } from '../../App';

import { Button, Icons, Sidebar, SidebarBody, SidebarLink, Header } from '@ohif/ui-next';

const links = [
  {
    label: 'Worklist',
    href: '/',
    icon: <Icons.Search className="h-5 w-5 flex-shrink-0 text-neutral-200" />,
  },
  {
    label: 'Local',
    href: '/local',
    icon: <Icons.Upload className="h-5 w-5 flex-shrink-0 text-neutral-200" />,
  },
];

const getLoadButton = (onDrop, text, isDir) => {
  return (
    <Dropzone
      onDrop={onDrop}
      noDrag
    >
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <Button
            variant="default"
            className="w-28"
            disabled={false}
            onClick={() => {}}
          >
            {text}
            {isDir ? (
              <input
                {...getInputProps()}
                {...({ webkitdirectory: 'true' } as any)}
                style={{ display: 'none' }}
              />
            ) : (
              <input
                {...getInputProps()}
                style={{ display: 'none' }}
              />
            )}
          </Button>
        </div>
      )}
    </Dropzone>
  );
};

type LocalProps = {
  modePath: string;
};

function Local({ modePath }: LocalProps) {
  const { servicesManager } = useSystem();
  const { customizationService } = servicesManager.services;
  const navigate = useNavigate();
  const location = useLocation();
  const dropzoneRef = useRef();
  const [dropInitiated, setDropInitiated] = React.useState(false);

  const LoadingIndicatorProgress: React.ComponentType<any> = customizationService.getCustomization(
    'ui.loadingIndicatorProgress'
  ) as any;

  // Initializing the dicom local dataSource
  const dataSourceModules = extensionManager.modules[MODULE_TYPES.DATA_SOURCE];
  const localDataSources = dataSourceModules.reduce((acc, curr) => {
    const mods = [];
    curr.module.forEach(mod => {
      if (mod.type === 'localApi') {
        mods.push(mod);
      }
    });
    return acc.concat(mods);
  }, []);

  const firstLocalDataSource = localDataSources[0];
  const dataSource = firstLocalDataSource.createDataSource({});

  const microscopyExtensionLoaded = extensionManager.registeredExtensionIds.includes(
    '@ohif/extension-dicom-microscopy'
  );

  const onDrop = async acceptedFiles => {
    const studies = await filesToStudies(acceptedFiles, dataSource);

    const query = new URLSearchParams();

    if (microscopyExtensionLoaded) {
      const smStudies = studies.filter(id => {
        const study = DicomMetadataStore.getStudy(id);
        return (
          study.series.findIndex(s => s.Modality === 'SM' || s.instances[0].Modality === 'SM') >= 0
        );
      });

      if (smStudies.length > 0) {
        smStudies.forEach(id => query.append('StudyInstanceUIDs', id));

        modePath = 'microscopy';
      }
    }

    studies.forEach(id => query.append('StudyInstanceUIDs', id));
    query.append('datasources', 'dicomlocal');

    navigate(`/${modePath}?${decodeURIComponent(query.toString())}`);
  };

  // Set body style
  useEffect(() => {
    document.body.classList.add('bg-black');
    return () => {
      document.body.classList.remove('bg-black');
    };
  }, []);

  // Auto-load from URL query parameter
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const url = query.get('url');

    if (url) {
      setDropInitiated(true);
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then(blob => {
          const filename = url.split('/').pop() || 'download.dcm';
          const file = new File([blob], filename, { type: 'application/dicom' });
          onDrop([file]);
        })
        .catch(err => {
          console.error('Failed to load file from URL', err);
          setDropInitiated(false);
        });
    }
  }, [location.search]);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
      <Header
        isSticky
        menuOptions={[]}
        isReturnEnabled={false}
        WhiteLabeling={undefined}
      />
      <div className="flex flex-1 flex-row overflow-hidden">
        <Sidebar>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                  />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <Dropzone
          ref={dropzoneRef}
          onDrop={acceptedFiles => {
            setDropInitiated(true);
            onDrop(acceptedFiles);
          }}
          noClick
        >
          {({ getRootProps }) => (
            <div
              {...getRootProps()}
              className="h-full w-full"
            >
              <div className="flex h-full w-full items-center justify-center">
                <div className="bg-muted border-primary/60 mx-auto space-y-2 rounded-xl border border-dashed bg-black/80 py-12 px-12 drop-shadow-md">
                  <div className="flex items-center justify-center">
                    <Icons.OHIFLogoColorDarkBackground className="h-18" />
                  </div>
                  <div className="space-y-2 py-6 text-center">
                    {dropInitiated ? (
                      <div className="flex flex-col items-center justify-center pt-12">
                        {LoadingIndicatorProgress && (
                          <LoadingIndicatorProgress className={'h-full w-full bg-black'} />
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-primary pt-0 text-xl">
                          Drag and drop your DICOM, Image, or PDF files <br />
                          to load them locally.
                        </p>
                        <p className="text-muted-foreground text-base">
                          Note: Your data remains locally within your browser
                          <br /> and is never uploaded to any server.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center gap-2 pt-4">
                    {getLoadButton(onDrop, 'Load files', false)}
                    {getLoadButton(onDrop, 'Load folders', true)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
}

export default Local;
